import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  slug: string;

  @Prop({ required: true })
  icon: string;

}

export const CategorySchema = SchemaFactory.createForClass(Category);
