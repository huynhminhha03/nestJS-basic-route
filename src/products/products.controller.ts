import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './models/product.schema';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Role } from 'src/roles/role.enum';
import { GetProductDto } from './dto/get-product.dto';

@Controller('products')
@Auth(Role.Admin)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.create(createProductDto);
  }

  @Get('result')
  async findAll(
    @Query('isActive') isActive?: boolean,
  ): Promise<GetProductDto[]> {
    return await this.productsService.findAll();
  }

  @Get()
  async findAllByUser(): Promise<GetProductDto[]> {
    return await this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  async remove(@Param('id') id: string): Promise<void> {
    await this.productsService.remove(id);
  }
}
