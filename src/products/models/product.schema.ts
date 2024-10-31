import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Variant, VariantSchema } from './variant.schema'; // Nhớ import Variant schema

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ unique: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true }) 
  category: Types.ObjectId;

  @Prop({ type: [VariantSchema], default: [] })
  variants: Variant[]; // Mảng các variant của sản phẩm

  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
