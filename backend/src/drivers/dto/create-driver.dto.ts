import { IsOptional, IsString } from 'class-validator';

export class CreateDriverDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  firstname!: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
