import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SpecificationGroup } from './specification.schema';

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

  @Prop()
  thumbnail?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  isPublished: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
