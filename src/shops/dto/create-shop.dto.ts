// create-shop.dto.ts
import { IsNotEmpty, IsString, IsObject, IsPhoneNumber, IsOptional } from 'class-validator';

export class CreateShopDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsObject()
  location: {
    latitude: number;
    longitude: number;
  };

  @IsOptional()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  image: string;
}
