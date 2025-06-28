import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class ImageSchema {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;
}
