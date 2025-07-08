import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class WarrantySchema {
  @Prop({ required: true })
  duration: string;

  @Prop()
  type?: string;

  @Prop()
  description?: string;
}
