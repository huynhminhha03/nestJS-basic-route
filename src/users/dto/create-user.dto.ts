import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Role } from '../../roles/role.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString() 
  @IsNotEmpty() 
  username: string; 

  @IsEmail()
  @IsNotEmpty()
  email: string;
  
  @IsString() 
  @IsNotEmpty() 
  password: string; 

  @IsOptional()
  @IsString() 
  bio: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Invalid role value' })
  role?: Role;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
