import { IsNotEmpty, IsString,IsEmail } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty()
  otp: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
