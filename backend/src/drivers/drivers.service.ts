import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.driver.findMany({
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async create(dto: CreateDriverDto) {
    if (dto.code) {
      const exists = await this.prisma.driver.findUnique({
        where: { code: dto.code },
      });

      if (exists) {
        throw new ConflictException('Driver code already exists');
      }
    }

    return this.prisma.driver.create({
      data: {
        code: dto.code,
        firstname: dto.firstname,
        lastname: dto.lastname,
        phone: dto.phone,
        bankName: dto.bankName,
        bankAccountNo: dto.bankAccountNo,
        bankAccountName: dto.bankAccountName,
      },
    });
  }

  async update(id: number, dto: UpdateDriverDto) {
    await this.findOne(id);

    if (dto.code) {
      const exists = await this.prisma.driver.findFirst({
        where: {
          code: dto.code,
          id: { not: id },
        },
      });

      if (exists) {
        throw new ConflictException('Driver code already exists');
      }
    }

    return this.prisma.driver.update({
      where: { id },
      data: {
        code: dto.code,
        firstname: dto.firstname,
        lastname: dto.lastname,
        phone: dto.phone,
        bankName: dto.bankName,
        bankAccountNo: dto.bankAccountNo,
        bankAccountName: dto.bankAccountName,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.driver.delete({
      where: { id },
    });
  }
}
