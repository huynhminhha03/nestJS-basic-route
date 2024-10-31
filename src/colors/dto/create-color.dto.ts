import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColorDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsNotEmpty()
  @IsString()
  imageColor: string;
}
