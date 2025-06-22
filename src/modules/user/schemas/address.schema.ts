import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Address extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  country: string;

  @Prop({ default: false })
  isPrimary: boolean;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  street: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
