import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ColorDocument = HydratedDocument<Color>;

@Schema()
export class Color {
    _id: Types.ObjectId;
    
  @Prop({ required: true, unique: true })
  name: string; 

  @Prop({ required: true })
  imageColor: string; 
}

export const ColorSchema = SchemaFactory.createForClass(Color);
