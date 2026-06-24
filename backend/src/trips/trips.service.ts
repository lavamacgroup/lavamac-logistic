import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.trip.findMany({
      orderBy: {
        tripDate: 'desc',
      },
      include: {
        driver: true,
        truck: true,
        customer: true,
      },
    });
  }

  async findOne(id: number) {
    const trip = await this.prisma.trip.findUnique({
      where: { id },
      include: {
        driver: true,
        truck: true,
        customer: true,
      },
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    return trip;
  }

  create(dto: CreateTripDto) {
    return this.prisma.trip.create({
      data: {
        tripDate: new Date(dto.tripDate),

        driverId: dto.driverId,
        truckId: dto.truckId,
        customerId: dto.customerId,

        jobType: dto.jobType,
        bookingNo: dto.bookingNo,
        containerNo: dto.containerNo,

        origin: dto.origin,
        destination: dto.destination,
        distanceKm: dto.distanceKm,

        freightPrice: dto.freightPrice ?? 0,
        subcontractCost: dto.subcontractCost,
        advanceAmount: dto.advanceAmount,

        pickupFee: dto.pickupFee,
        shoreFee: dto.shoreFee,
        returnFee: dto.returnFee,
        portFee: dto.portFee,
        dropFee: dto.dropFee,
        tollFee: dto.tollFee,
        maintenanceFee: dto.maintenanceFee,
        electricFee: dto.electricFee,
        prepaidExpense: dto.prepaidExpense,

        netProfit: dto.netProfit,
        reimbursableAmount: dto.reimbursableAmount,

        tripStatus: dto.tripStatus,
        billingStatus: dto.billingStatus,

        note: dto.note,
      },
      include: {
        driver: true,
        truck: true,
        customer: true,
      },
    });
  }

  async update(id: number, dto: UpdateTripDto) {
    await this.findOne(id);

    return this.prisma.trip.update({
      where: { id },
      data: {
        ...(dto.tripDate ? { tripDate: new Date(dto.tripDate) } : {}),

        driverId: dto.driverId,
        truckId: dto.truckId,
        customerId: dto.customerId,

        jobType: dto.jobType,
        bookingNo: dto.bookingNo,
        containerNo: dto.containerNo,

        origin: dto.origin,
        destination: dto.destination,
        distanceKm: dto.distanceKm,

        freightPrice: dto.freightPrice,
        subcontractCost: dto.subcontractCost,
        advanceAmount: dto.advanceAmount,

        pickupFee: dto.pickupFee,
        shoreFee: dto.shoreFee,
        returnFee: dto.returnFee,
        portFee: dto.portFee,
        dropFee: dto.dropFee,
        tollFee: dto.tollFee,
        maintenanceFee: dto.maintenanceFee,
        electricFee: dto.electricFee,
        prepaidExpense: dto.prepaidExpense,

        netProfit: dto.netProfit,
        reimbursableAmount: dto.reimbursableAmount,

        tripStatus: dto.tripStatus,
        billingStatus: dto.billingStatus,

        note: dto.note,
      },
      include: {
        driver: true,
        truck: true,
        customer: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.trip.delete({
      where: { id },
    });
  }
}
