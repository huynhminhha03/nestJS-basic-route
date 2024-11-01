import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './models/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import slugify from 'slugify';
import { GetProductDto } from './dto/get-product.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productModel
      .findOne({ name: createProductDto.name })
      .exec();

    if (existingProduct) {
      throw new ConflictException(
        `Product with name ${createProductDto.name} already exists`,
      );
    }

    const slug = slugify(createProductDto.name, {
      lower: true,
      strict: true,
      locale: 'vi',
    });


    const newProduct = new this.productModel({
      ...createProductDto,
      slug,
      categories: createProductDto.categories.map(id => new Types.ObjectId(id)),
      variants: createProductDto.variants.map((variant) => ({
        color: new Types.ObjectId(variant.color), 
        sizes: variant.sizes,
        images: variant.images,
      }))
    });

    console.log('New Product before save:', newProduct);


    return await newProduct.save();
  }

  async findAll(): Promise<GetProductDto[]> {
    const products = await this.productModel
      .find()
      .populate({
        path: 'variants',
        select: 'color',
      })
      .lean()
      .exec();

    const plainProducts = products.map((product) => {
      const { variants, ...productData } = product;
      return {
        ...productData,
        variants: variants.map((variant) => ({ color: variant.color })),
      };
    });

    return plainToInstance(GetProductDto, plainProducts);
  }

  async findAllByUser(): Promise<Product[]> {
    return this.productModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<Product> {
    const result = await this.productModel.findById(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return result;
  }

  async findOneByUser(id: string): Promise<Product> {
    const result = await this.productModel
      .findOne({ id, isActive: true })
      .exec();
    if (!result) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return result;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const result = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      {
        new: true,
      },
    );
    if (!result) {
      throw new NotFoundException('Product not found');
    }
    return result;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Product not found');
    }
  }
}
