import { Types } from 'mongoose';
import { SpecificationGroup } from './specification.interface';

export type DiscountType = 'PERCENT' | 'FIXED';

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
  thumbnail?: string;
  images: string[];
  isFeatured: boolean;
  isPublished: boolean;
}
