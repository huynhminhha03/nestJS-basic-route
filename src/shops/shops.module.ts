import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { Shop, ShopSchema } from './models/shop.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: ShopSchema }]),
  ],

  controllers: [ShopsController],
  providers: [ShopsService,
    
  ],
})
export class ShopsModule {}
