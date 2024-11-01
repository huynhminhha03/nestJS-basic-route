import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from 'src/auth/passport/jwt-auth.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async createAddress(
    @Body() createAddressDto: CreateAddressDto,
    @Req() req: any,
  ) {
    const userId = req.user._id;
    return this.addressesService.create(createAddressDto, userId);
  }

  @Get()
  async getAddresses(@Req() req: any) {
    const userId = req.user._id;
    return this.addressesService.findByUser(userId);
  }

  @Get(':id')
  async getAddressById(@Param('id') id: string) {
    return await this.addressesService.getAddressById(id);
  }

  @Put(':id')
  async updateAddress(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id')
  async deleteAddress(@Param('id') id: string): Promise<void> {
    await this.addressesService.deleteAddress(id);
    return;
  }
}
