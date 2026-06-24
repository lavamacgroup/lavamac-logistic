import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const toNumber = (value: any) => Number(value ?? 0);

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const now = new Date();
    const year = now.getFullYear();

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);

    const [totalTrips, completedTrips, revenue, trips] = await Promise.all([
      this.prisma.trip.count(),

      this.prisma.trip.count({
        where: { tripStatus: 'COMPLETED' },
      }),

      this.prisma.trip.aggregate({
        _sum: {
          freightPrice: true,
          netProfit: true,
        },
      }),

      this.prisma.trip.findMany({
        where: {
          tripDate: {
            gte: startOfYear,
            lt: endOfYear,
          },
        },
        select: {
          tripDate: true,
          freightPrice: true,
          netProfit: true,
        },
      }),
    ]);

    const monthly = Array.from({ length: 12 }, (_, index) => ({
      month: index + 1,
      revenue: 0,
      profit: 0,
      trips: 0,
    }));

    for (const trip of trips) {
      const monthIndex = trip.tripDate.getMonth();

      monthly[monthIndex].revenue += toNumber(trip.freightPrice);
      monthly[monthIndex].profit += toNumber(trip.netProfit);
      monthly[monthIndex].trips += 1;
    }

    return {
      totalTrips,
      completedTrips,
      totalRevenue: toNumber(revenue._sum.freightPrice),
      totalProfit: toNumber(revenue._sum.netProfit),
      monthly,
    };
  }
}
