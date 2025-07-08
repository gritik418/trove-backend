import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SpecificationGroup } from './specification.schema';
import { ImageSchema } from './image.schema';
import { OfferSchema } from './offer.schema';
import { WarrantySchema } from './warranty.schema';
import { ReturnPolicySchema } from './return-policy.schema';

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  brand?: string;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ type: [String], default: [] })
  highlights?: string[];

  @Prop()
  size?: string;

  @Prop()
  color?: string;

  @Prop({ type: [SpecificationGroup], default: [] })
  specifications?: SpecificationGroup[];

  @Prop({ required: true })
  price: number;

  @Prop()
  sku?: string;

  @Prop({ enum: ['PERCENT', 'FIXED'], default: 'PERCENT' })
  discountType?: 'PERCENT' | 'FIXED';

  @Prop()
  discountValue?: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ type: ImageSchema })
  thumbnail?: ImageSchema;

  @Prop({ type: [ImageSchema], default: [] })
  images: ImageSchema[];

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ type: [OfferSchema], default: [] })
  offers?: OfferSchema[];

  @Prop({ type: WarrantySchema })
  warranty?: WarrantySchema;

  @Prop({ type: ReturnPolicySchema })
  returnPolicy?: ReturnPolicySchema;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
