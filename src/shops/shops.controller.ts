// shop.controller.ts
import { Body, Controller, Get, Param, Post, Put,Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { Role } from 'src/roles/role.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('shops')
@Auth(Role.Admin)
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Post()
  async createShop(@Body() createShopDto: CreateShopDto) {
    return this.shopsService.create(createShopDto);
  }

  @Get(':id')
  async getShop(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }

  @Get()
  @Public()
  async getAllShops() {
    return this.shopsService.findAll();
  }

  @Put(':id')
  async updateShop(@Param('id') id: string, @Body() updateShopDto: CreateShopDto) {
    return this.shopsService.update(id, updateShopDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  async remove(@Param('id') id: string): Promise<void> {
    await this.shopsService.remove(id);
  }
}
