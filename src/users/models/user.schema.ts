import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Role } from '../../roles/role.enum'; 

export type UserDocument = HydratedDocument<User>;


@Schema({ timestamps: true }) 
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true }) 
  username: string; 

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true }) 
  password: string; 

  @Prop({ required: false }) 
  bio: string; 

  @Prop({ required: false, default: true }) 
  isActive: boolean; 

  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.password; 
    return ret;
  },
});
