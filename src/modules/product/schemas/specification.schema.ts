import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
class SpecificationItem {
  @Prop()
  key: string;

  @Prop()
  value: string;
}

@Schema()
export class SpecificationGroup {
  @Prop()
  name: string;

  @Prop({ type: [SpecificationItem] })
  specifications: SpecificationItem[];
}
