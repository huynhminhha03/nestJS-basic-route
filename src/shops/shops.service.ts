// shop.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop, ShopDocument } from './models/shop.schema';
import { CreateShopDto } from './dto/create-shop.dto';

@Injectable()
export class ShopsService {
  constructor(@InjectModel(Shop.name) private shopModel: Model<ShopDocument>) {}

  async create(createShopDto: CreateShopDto): Promise<Shop> {
    const newShop = new this.shopModel(createShopDto);
    return newShop.save();
  }

  async findOne(id: string): Promise<Shop> {
    return this.shopModel.findById(id).exec();
  }

  async findAll(): Promise<Shop[]> {
    return this.shopModel.find().exec();
  }

  async update(id: string, updateShopDto: CreateShopDto): Promise<Shop> {
    return this.shopModel.findByIdAndUpdate(id, updateShopDto, { new: true }).exec();
  }

  async remove(id: string): Promise<void> {
    const result = await this.shopModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Shop not found');
    }
  }
}
