// shop.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShopDocument = HydratedDocument<Shop>;

@Schema()
export class Shop {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: { latitude: Number, longitude: Number }, required: true, _id: false })
  location: {
    latitude: number;
    longitude: number;
  };

  @Prop()
  phone: string;

  @Prop()
  image: string;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
