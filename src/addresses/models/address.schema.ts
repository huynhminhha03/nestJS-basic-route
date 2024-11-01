import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AddressDocument = HydratedDocument<Address>;

@Schema()
export class Address {
  _id: Types.ObjectId;

  

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  street: string; // Địa chỉ chi tiết như số nhà, tên đường

  @Prop({ required: true })
  ward: string; // Phường/Xã

  @Prop({ required: true })
  district: string; // Quận/Huyện

  @Prop({ required: true })
  province: string; // Tỉnh/Thành phố

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
  
  @Prop({ default: false })
  isDefault: boolean; // Đánh dấu nếu là địa chỉ mặc định
}

export const AddressSchema = SchemaFactory.createForClass(Address);
