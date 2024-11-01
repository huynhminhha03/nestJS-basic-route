import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Address, AddressDocument } from './models/address.schema';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
  ) {}

  async create(
    createAddressDto: CreateAddressDto,
    userId: ObjectId,
  ): Promise<Address> {

    if (createAddressDto.isDefault) {
      await this.addressModel.updateMany(
        { user: userId },
        { isDefault: false },
      );
    }
    const address = new this.addressModel({
      ...createAddressDto,
      user: userId,
    });
    return await address.save();
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.addressModel.findById(id);
    if (!address) throw new NotFoundException('Address not found');
    if (updateAddressDto.isDefault) {
      await this.addressModel.updateMany(
        { user: address.user },
        { isDefault: false },
      );
    }
    return this.addressModel.findByIdAndUpdate(id, updateAddressDto, {
      new: true,
    });
  }

  async findByUser(userId: string): Promise<Address[]> {
    return this.addressModel.find({ user: userId });
  }

  async getAddressById(id: string): Promise<Address> {
    const address = await this.addressModel.findById(id);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return address;
  }

  async deleteAddress(id: string): Promise<Address> {
    const address = await this.addressModel.findById(id);

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (address.isDefault) {
      throw new BadRequestException('Cannot delete the default address');
    }

    return this.addressModel.findByIdAndDelete(id);
  }
}
