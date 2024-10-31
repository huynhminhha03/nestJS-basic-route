import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Color, ColorDocument } from './models/color.schema';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorsService {
  constructor(@InjectModel(Color.name) private colorModel: Model<ColorDocument>) {}

  async create(createColorDto: CreateColorDto): Promise<Color> {
    if (await this.colorModel.exists({ name: createColorDto.name })) {
      throw new ConflictException(`Color with name ${createColorDto.name} already exists`);
    }
    const color = new this.colorModel(createColorDto);
    return await color.save();
  }

  async findAll(): Promise<Color[]> {
    return await this.colorModel.find().exec();
  }

  async findOne(id: string): Promise<Color> {
    const color = await this.colorModel.findById(id).exec();
    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }
    return color.toObject();
  }

  async update(id: string, updateColorDto: UpdateColorDto): Promise<Color> {
    const updatedColor = await this.colorModel.findByIdAndUpdate(id, updateColorDto, {
      new: true,
    }).exec();
    if (!updatedColor) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }
    return updatedColor.toObject();
  }

  async remove(id: string): Promise<void> {
    const result = await this.colorModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }
  }
}
