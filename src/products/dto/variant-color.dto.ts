import { Expose } from 'class-transformer';

export class VariantColorDto {
  @Expose()
  color: string;

  @Expose()
  imageColor: string;
}
