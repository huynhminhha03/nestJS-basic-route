import { Body, Controller, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAccountDto } from './dto/login-account.dto';
import { RegisterAccountDto } from './dto/register-account.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResetPassUserDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async validateUser(@Body() authDto: LoginAccountDto) {
    return this.authService.signIn(authDto);
  }

  //Register account
  @Post('verify-email')
  async sendOTP(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterAccountDto) {
    return this.authService.register(registerDto);
  }

  //Forgot password
  @Post('check-email')
  async checkEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.checkEmail(verifyEmailDto);
  }

  @Post('verify-OTP')
  async verifyOTP(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOTP(verifyOtpDto);
  }

  @Post('reset-password')
  async resetPassword(@Query('email') verifyEmailDto: VerifyEmailDto,  @Body() resetPassUserDto: ResetPassUserDto) {
    return this.authService.resetPassword(verifyEmailDto, resetPassUserDto);
  }
}
