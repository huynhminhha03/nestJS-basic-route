import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateVariantDto {
  

  @IsArray()
  @IsString({ each: true })
  images: string[];

  @IsArray()
  @IsNotEmpty({ each: true }) 
  sizes: { size: string; quantity: number }[];

  @IsMongoId()
  @IsNotEmpty()
  color: Types.ObjectId;
}