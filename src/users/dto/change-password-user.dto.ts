import { IsString, IsNotEmpty } from 'class-validator';

export class ChangePassUserDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
