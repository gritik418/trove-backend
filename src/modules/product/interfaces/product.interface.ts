import { Types } from 'mongoose';
import { SpecificationGroup } from '../schemas/zod/specification.zod';

export type DiscountType = 'PERCENT' | 'FIXED';

export interface Image {
  url: string;
  publicId: string;
}

export interface Product {
  _id: Types.ObjectId;
  name: string;
  title: string;
  slug: string;
  description: string;
  brand?: string;
  categories: string[];
  highlights?: string[];
  size?: string;
  color?: string;
  specifications?: SpecificationGroup[];
  price: number;
  sku?: string;
  discountType?: DiscountType;
  discountValue?: number;
  stock: number;
  thumbnail?: Image;
  images: Image[];
  isFeatured: boolean;
  isPublished: boolean;
}
