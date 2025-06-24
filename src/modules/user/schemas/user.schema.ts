import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../../common/enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, minlength: 3 })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ minlength: 8 })
  password: string;

  @Prop()
  phone?: string;

  @Prop()
  avatar?: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ enum: ['active', 'inactive', 'banned'], default: 'active' })
  status: UserStatus;

  @Prop({ enum: ['customer', 'admin', 'seller'], default: 'customer' })
  role: Role;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  emailVerificationTokenExpiry?: Date;

  @Prop()
  resetPasswordToken?: string;

  @Prop()
  resetPasswordTokenExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
