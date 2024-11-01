// addresses.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';
import { Address, AddressSchema } from './models/address.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]), 
  ],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
