import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class OfferSchema {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  terms?: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ required: true })
  isActive: boolean;
}
