import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  Length,
} from 'class-validator';

export class RegisterAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}
