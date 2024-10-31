// create-address.dto.ts
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @Matches(/^(0|\+84)[0-9]{9}$/)
  phone: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  ward: string;

  @IsNotEmpty()
  @IsString()
  district: string;

  @IsNotEmpty()
  @IsString()
  province: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

