import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userSelect = {
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
  };

  findAll() {
    return this.prisma.user.findMany({
      select: this.userSelect,
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.userSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.username || dto.email) {
      const exists = await this.prisma.user.findFirst({
        where: {
          id: {
            not: id,
          },
          OR: [
            ...(dto.username ? [{ username: dto.username }] : []),
            ...(dto.email ? [{ email: dto.email }] : []),
          ],
        },
      });

      if (exists) {
        throw new ConflictException('Username or email already exists');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        username: dto.username,
        email: dto.email,
        firstname: dto.firstname,
        lastname: dto.lastname,
        phone: dto.phone,
        role: dto.role,
        status: dto.status,
      },
      select: this.userSelect,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.session.updateMany({
      where: {
        userId: id,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    return this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.INACTIVE,
      },
      select: this.userSelect,
    });
  }
}