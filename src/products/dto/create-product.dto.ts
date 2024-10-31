import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsMongoId
} from 'class-validator';
import { Types } from 'mongoose';
import { CreateVariantDto } from './create-variant.dto';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsMongoId()
  category: Types.ObjectId;


  @IsNotEmpty()
  @IsArray()
  variants: CreateVariantDto[];

  @IsOptional()
  isActive: boolean;
}