import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // สร้าง Pool การเชื่อมต่อของ node-postgres
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // ส่ง pool ไปยัง PrismaPg adapter
    const adapter = new PrismaPg(pool);

    // เรียก super และส่ง adapter เข้าไป
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
