import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserByAdminDto } from './dto/update-user-by-admin.dto';
import { User } from './models/user.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { Role } from '../roles/role.enum';
import { UpdateInfoUserDto } from './dto/update-info-user.dto';
import { ChangePassUserDto } from './dto/change-password-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req: any): Promise<User> {
    const userId = req.user.id;
    return this.usersService.findOne(userId);
  }

  @Get(':username')
  async findBySlug(
    @Param('username') username: string,
  ): Promise<User> {
   
    return this.usersService.findByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/update-info')
  async updateInfo(
    @Request() req: any,
    @Body() updateInfoUserDto: UpdateInfoUserDto,
  ): Promise<User> {
    const userId = req.user.id;
    const username = req.user.username;
    return this.usersService.updateInfo(userId, username, updateInfoUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/update-password')
  async updatePassword(
    @Request() req: any,
    @Body() updatePassUserDto: ChangePassUserDto,
  ): Promise<User> {
    const userId = req.user.id;
    return this.usersService.updatePassword(userId, updatePassUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Staff)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Staff)
  @Get('/admin/:id')
  async findOneByAdmin(@Param('id') id: string): Promise<User> {
    return this.usersService.findOneByAdmin(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Staff)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createByAdmin(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Staff)
  @Patch(':id')
  async updateByAdmin(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateInfoUserDto: UpdateUserByAdminDto,
  ): Promise<User> {
    const userRole = req.user.role;
    if (userRole !== Role.Admin && updateInfoUserDto.role) {
      throw new UnauthorizedException('You do not have permission to update the role.');
    }
    return this.usersService.updateByAdmin(id, updateInfoUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
