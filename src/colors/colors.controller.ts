import { Controller, Get, Post, Body, Param, Patch, Delete, NotFoundException } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './models/color.schema';
import { Role } from 'src/roles/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('colors')
@Auth(Role.Admin)
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  async create(@Body() createColorDto: CreateColorDto): Promise<Color> {
    return await this.colorsService.create(createColorDto);
  }

  @Get()
  async findAll(): Promise<Color[]> {
    return await this.colorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Color> {
    return await this.colorsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateColorDto: UpdateColorDto,
  ): Promise<Color> {
    return await this.colorsService.update(id, updateColorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.colorsService.remove(id);
  }
}
