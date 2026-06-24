import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const exists = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.email ?? undefined }],
      },
    });

    if (exists) {
      throw new ConflictException('Username or email already exists');
    }

    const passwordHash = await argon2.hash(dto.password);

    return this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email ?? null,
        passwordHash,
        firstname: dto.firstname ?? null,
        lastname: dto.lastname ?? null,
        phone: dto.phone ?? null,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async login(dto: LoginDto, userAgent?: string, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User is not active');
    }

    const validPassword = await argon2.verify(user.passwordHash, dto.password);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid username or password');
    }

    await this.prisma.session.updateMany({
      where: {
        userId: user.id,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    const refreshDays = Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS ?? 7);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + refreshDays);

    const tempRefreshToken = randomUUID();
    const refreshTokenHash = await argon2.hash(tempRefreshToken);

    const session = await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        sessionId: session.id,
        role: user.role,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET ?? 'access-secret',
        expiresIn: 60 * 15,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        sessionId: session.id,
        token: tempRefreshToken,
      },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret',
        expiresIn: 60 * 60 * 24 * refreshDays,
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(userId: number, sessionId: number) {
    await this.prisma.session.updateMany({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return { message: 'Logged out successfully' };
  }

  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        firstname: true,
        lastname: true,
        phone: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async refresh(refreshToken: string) {
    let payload: {
      sub: number;
      sessionId: number;
      token: string;
    };

    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const oldSession = await this.prisma.session.findFirst({
      where: {
        id: payload.sessionId,
        userId: payload.sub,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!oldSession) {
      throw new UnauthorizedException('Session expired or logged in elsewhere');
    }

    const validRefreshToken = await argon2.verify(
      oldSession.refreshTokenHash,
      payload.token,
    );

    if (!validRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.session.update({
      where: {
        id: oldSession.id,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    const refreshDays = Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS ?? 7);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + refreshDays);

    const newTempRefreshToken = randomUUID();
    const newRefreshTokenHash = await argon2.hash(newTempRefreshToken);

    const newSession = await this.prisma.session.create({
      data: {
        userId: oldSession.userId,
        refreshTokenHash: newRefreshTokenHash,
        userAgent: oldSession.userAgent,
        ipAddress: oldSession.ipAddress,
        expiresAt,
      },
    });

    const accessToken = await this.jwtService.signAsync(
      {
        sub: oldSession.user.id,
        sessionId: newSession.id,
        role: oldSession.user.role,
      },
      {
        secret: process.env.JWT_ACCESS_SECRET ?? 'access-secret',
        expiresIn: 60 * 15,
      },
    );

    const newRefreshToken = await this.jwtService.signAsync(
      {
        sub: oldSession.user.id,
        sessionId: newSession.id,
        token: newTempRefreshToken,
      },
      {
        secret: process.env.JWT_REFRESH_SECRET ?? 'refresh-secret',
        expiresIn: 60 * 60 * 24 * refreshDays,
      },
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
