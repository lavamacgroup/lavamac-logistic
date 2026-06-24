import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BillingStatus, TripStatus } from '@prisma/client';

export class CreateTripDto {
  @IsDateString()
  tripDate!: string;

  @IsOptional()
  @IsNumber()
  driverId?: number;

  @IsOptional()
  @IsNumber()
  truckId?: number;

  @IsOptional()
  @IsNumber()
  customerId?: number;

  @IsOptional()
  @IsString()
  jobType?: string;

  @IsOptional()
  @IsString()
  bookingNo?: string;

  @IsOptional()
  @IsString()
  containerNo?: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsNumber()
  distanceKm?: number;

  @IsOptional()
  @IsNumber()
  freightPrice?: number;

  @IsOptional()
  @IsNumber()
  subcontractCost?: number;

  @IsOptional()
  @IsNumber()
  advanceAmount?: number;

  @IsOptional()
  @IsNumber()
  pickupFee?: number;

  @IsOptional()
  @IsNumber()
  shoreFee?: number;

  @IsOptional()
  @IsNumber()
  returnFee?: number;

  @IsOptional()
  @IsNumber()
  portFee?: number;

  @IsOptional()
  @IsNumber()
  dropFee?: number;

  @IsOptional()
  @IsNumber()
  tollFee?: number;

  @IsOptional()
  @IsNumber()
  maintenanceFee?: number;

  @IsOptional()
  @IsNumber()
  electricFee?: number;

  @IsOptional()
  @IsNumber()
  prepaidExpense?: number;

  @IsOptional()
  @IsNumber()
  netProfit?: number;

  @IsOptional()
  @IsNumber()
  reimbursableAmount?: number;

  @IsOptional()
  @IsEnum(TripStatus)
  tripStatus?: TripStatus;

  @IsOptional()
  @IsEnum(BillingStatus)
  billingStatus?: BillingStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
