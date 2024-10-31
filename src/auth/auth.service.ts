import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as speakeasy from 'speakeasy';
import { UsersService } from 'src/users/users.service';
import { LoginAccountDto } from './dto/login-account.dto';
import { RegisterAccountDto } from './dto/register-account.dto';
import {  VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { User } from 'src/users/models/user.schema';
import { ResetPassUserDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private otpVerifyEmails: { [key: string]: { otp: string; createdAt: Date } } =
    {};
  private otpForgotPasswords: {
    [key: string]: { otp: string; createdAt: Date };
  } = {};

  private otpVerifiedTimes: { [email: string]: Date } = {};

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  // Đăng nhập tài khoản
  async signIn(authDto: LoginAccountDto): Promise<{ access_token: string }> {
    const { user, exists } = await this.usersService.checkEmailExists(
      authDto.email,
    );

    console.log('login user', user);
    console.log('userId', user._id);
    console.log(typeof user._id);
    if (!exists) {
      throw new UnauthorizedException('Invalid email!');
    }

    const isPasswordValid = await this.usersService.comparePasswords(
      authDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Your account is inactive. Please contact support.',
      );
    }

    const payload = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }

  // Xác minh email và gửi OTP
  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    const { exists } = await this.usersService.checkEmailExists(
      verifyEmailDto.email,
    );
    if (exists) {
      throw new UnauthorizedException('Email already exists!');
    } else {
      const secret = speakeasy.generateSecret({ length: 20 });
      const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        step: 300, // OTP hiệu lực trong 5 phút
      });

      this.otpVerifyEmails[verifyEmailDto.email] = {
        otp,
        createdAt: new Date(),
      };

      // Gửi OTP qua email
      await this.mailerService.sendMail({
        to: verifyEmailDto.email,
        subject: 'Mã OTP xác minh',
        text: `Mã OTP của bạn là: ${otp}. Mã sẽ hết hạn sau 5 phút.`,
      });
    }
    return { message: 'OTP has been sent to your email' };
  }

  // Gửi OTP quên mật khẩu
  async checkEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    const { exists } = await this.usersService.checkEmailExists(
      verifyEmailDto.email,
    );
    if (!exists) {
      throw new UnauthorizedException('Invalid email!');
    } else {
      const secret = speakeasy.generateSecret({ length: 20 });
      const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        step: 300, // OTP hiệu lực trong 5 phút
      });

      this.otpForgotPasswords[verifyEmailDto.email] = {
        otp,
        createdAt: new Date(),
      };

      // Gửi OTP qua email
      await this.mailerService.sendMail({
        to: verifyEmailDto.email,
        subject: 'Mã OTP xác minh',
        text: `Mã OTP của bạn là: ${otp}. Mã sẽ hết hạn sau 5 phút.`,
      });
    }
    return { message: 'OTP has been sent to your email' };
  }

  // Xác minh OTP cho email quên mật khẩu
  async verifyOTP(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<{ redirectUrl: string }> {
    const otpData = this.otpForgotPasswords[verifyOtpDto.email];
    if (!otpData) {
      throw new UnauthorizedException('OTP not found!');
    }

    const isOtpValid = otpData.otp === verifyOtpDto.otp;
    const isOtpExpired =
      new Date().getTime() - otpData.createdAt.getTime() > 5 * 60 * 1000;

    if (!isOtpValid || isOtpExpired) {
      throw new UnauthorizedException('Invalid or expired OTP!');
    }

    this.otpVerifiedTimes[verifyOtpDto.email] = new Date();

    return { redirectUrl: `/auth/reset-password?email=${verifyOtpDto.email}` };
  }

  async resetPassword(
    verifyEmailDto: VerifyEmailDto,
    resetPassUserDto: ResetPassUserDto,
  ): Promise<{ user: User; message: string }> {

    delete this.otpForgotPasswords[verifyEmailDto.email];

    const otpVerifiedTime = this.otpVerifiedTimes[verifyEmailDto.email];
    if (!otpVerifiedTime) {
      throw new UnauthorizedException('OTP verification not found!');
    }

    // Kiểm tra nếu quá 5 phút từ lúc OTP được xác thực
    const now = new Date().getTime();
    const timeElapsed = now - otpVerifiedTime.getTime();
    if (timeElapsed > 5 * 60 * 1000) {
      // 5 phút
      throw new UnauthorizedException('Time to change password has expired!');
    }

    const updateUser = await this.usersService.resetPassword(
      verifyEmailDto,
      resetPassUserDto,
    );

    // Xóa thời gian xác thực OTP sau khi đổi mật khẩu thành công
    delete this.otpVerifiedTimes[verifyEmailDto.email];

    return { user: updateUser, message: 'Password changed successfully' };
  }

  // Đăng ký tài khoản mới
  async register(
    registerDto: RegisterAccountDto,
  ): Promise<{ message: string }> {
    const otpData = this.otpVerifyEmails[registerDto.email];
    if (!otpData) {
      throw new UnauthorizedException('OTP not found!');
    }

    const isOtpValid = otpData.otp === registerDto.otp;
    const isOtpExpired =
      new Date().getTime() - otpData.createdAt.getTime() > 5 * 60 * 1000;

    if (!isOtpValid || isOtpExpired) {
      throw new UnauthorizedException('Invalid or expired OTP!');
    }

    await this.usersService.create(registerDto);
    delete this.otpVerifyEmails[registerDto.email];

    return { message: 'Registration successful! You can now sign in.' };
  }
}
