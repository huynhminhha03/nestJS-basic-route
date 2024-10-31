import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './models/product.schema';
import { Variant, VariantSchema } from './models/variant.schema';

@Module({
  imports: [
    
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Variant.name, schema: VariantSchema }
    ]),

  ],
  controllers: [ProductsController], 
  providers: [ProductsService], 
  exports: [ProductsService],
})
export class ProductsModule {}
