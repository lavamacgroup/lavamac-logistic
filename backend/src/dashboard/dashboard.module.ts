import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtModule } from '@nestjs/jwt';
import { DashboardController } from './dashboard.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  providers: [DashboardService, PrismaService],
  controllers: [DashboardController],
})
export class DashboardModule {}
