import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VariantDocument = HydratedDocument<Variant>;

@Schema({ _id: false }) // Không tạo ID cho Variant
export class Variant {
  

  @Prop({ type: [{ size: String, quantity: Number }], required: true })
  sizes: { size: string; quantity: number }[];

  @Prop({ type: [String], required: true })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'Color', required: true })
  color: Types.ObjectId;
}

export const VariantSchema = SchemaFactory.createForClass(Variant);
