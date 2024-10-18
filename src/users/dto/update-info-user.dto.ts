import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateInfoUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty() 
  @IsString() 
  username: string; 

  @IsNotEmpty()
  @IsString()
  bio: string;
}
