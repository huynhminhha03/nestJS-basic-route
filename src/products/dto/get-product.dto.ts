import { Exclude, Expose, Type } from 'class-transformer';
import { VariantColorDto } from './variant-color.dto'; // Nhớ import VariantColorDto
import { Types } from 'mongoose';

export class GetProductDto {
  @Expose()
  _id: Types.ObjectId;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Exclude()
  description: string;

  @Expose()
  slug: string;

  @Expose()
  imageDefault: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Type(() => VariantColorDto) 
  variants: VariantColorDto[]; 

}
