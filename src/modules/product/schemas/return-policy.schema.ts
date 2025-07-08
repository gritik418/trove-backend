import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class ReturnPolicySchema {
  @Prop({ required: true })
  isReturnable: boolean;

  @Prop()
  returnWindowDays?: number;

  @Prop()
  returnCharges?: string;

  @Prop()
  conditions?: string;

  @Prop()
  returnMethod?: string;
}
