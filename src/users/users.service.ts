import { VerifyEmailDto } from './../auth/dto/verify-email.dto';
import { RegisterAccountDto } from './../auth/dto/register-account.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { Model } from 'mongoose';
import { User, UserDocument } from './models/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';
import { UpdateInfoUserDto } from './dto/update-info-user.dto';
import { ChangePassUserDto } from './dto/change-password-user.dto';
import { ResetPassUserDto } from 'src/auth/dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async create(registerAccountDto: RegisterAccountDto): Promise<User> {
    const [emailCheck, usernameCheck] = await Promise.all([
      this.checkEmailExists(registerAccountDto.email),
      this.checkUsernameExists(registerAccountDto.username),
    ]);

    if (emailCheck.exists) {
      throw new ConflictException('Email already exists');
    }

    if (usernameCheck.exists) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await this.hashPassword(registerAccountDto.password);
    const createdUser = new this.userModel({
      ...registerAccountDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async createByAdmin(createUserDto: CreateUserDto): Promise<User> {
    const [emailCheck, usernameCheck] = await Promise.all([
      this.checkEmailExists(createUserDto.email),
      this.checkUsernameExists(createUserDto.username),
    ]);

    if (emailCheck.exists) {
      throw new ConflictException('Email already exists');
    }

    if (usernameCheck.exists) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async checkEmailExists(
    email: string,
  ): Promise<{ user: User; exists: boolean }> {
    const user = await this.userModel.findOne({ email }).exec();
    return { user, exists: !!user };
  }

  async checkUsernameExists(
    username: string,
  ): Promise<{ user: User; exists: boolean }> {
    const user = await this.userModel.findOne({ username }).exec();
    return { user, exists: !!user };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findOne({ _id: id, isActive: true })
      .exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const { user, exists } = await this.checkUsernameExists(username);
    if (!exists) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async findOneByAdmin(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async updateInfo(
    userId: string,
    username: string,
    updateUserDto: UpdateInfoUserDto,
  ): Promise<User> {
    if (updateUserDto.username !== username) {
      const { exists } = await this.checkUsernameExists(updateUserDto.username);
      if (exists) {
        throw new ConflictException(
          `Username ${updateUserDto.username} is already taken`,
        );
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { $set: updateUserDto }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return updatedUser;
  }

  async resetPassword(
    verifyEmailDto: VerifyEmailDto,
    changePassUserDto: ResetPassUserDto,
  ): Promise<User> {
    const { user, exists } = await this.checkEmailExists(verifyEmailDto.email);
    if (!exists) {
      throw new NotFoundException('User not found');
    }

    if (changePassUserDto.newPassword !== changePassUserDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match!');
    }

    const newPassword = await this.hashPassword(changePassUserDto.newPassword);

    return this.userModel.findByIdAndUpdate(
      user._id,
      { password: newPassword },
      { new: true },
    );
  }

  async updatePassword(
    userId: string,
    updatePassUserDto: ChangePassUserDto,
  ): Promise<User> {
    if (updatePassUserDto.newPassword === updatePassUserDto.oldPassword) {
      throw new BadRequestException(
        'New password cannot be the same as the old password',
      );
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const isPasswordValid = await this.comparePasswords(
      updatePassUserDto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password!');
    }

    const newPassword = await this.hashPassword(updatePassUserDto.newPassword);

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { password: newPassword }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return updatedUser;
  }

  async updateByAdmin(
    id: string,
    updateUserByAdminDto: UpdateUserByAdminDto,
  ): Promise<User> {
    if (updateUserByAdminDto.password) {
      updateUserByAdminDto.password = await this.hashPassword(
        updateUserByAdminDto.password,
      );
    }

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.username !== updateUserByAdminDto.username) {
      const { exists } = await this.checkUsernameExists(
        updateUserByAdminDto.username,
      );

      if (exists) {
        throw new ConflictException(
          `Username ${updateUserByAdminDto.username} is already taken`,
        );
      }
    }

    Object.assign(user, updateUserByAdminDto);
    return user.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
