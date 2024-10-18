import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { Role } from '../../roles/role.enum';

export class UpdateUserByAdminDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty() 
  @IsString() 
  username: string; 

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
