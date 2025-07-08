import { Types } from 'mongoose';
import { SpecificationGroup } from '../schemas/zod/specification.zod';

export type DiscountType = 'PERCENT' | 'FIXED';

export interface Image {
  url: string;
  publicId: string;
}

export interface Offer {
  title: string;
  description?: string;
  terms?: string;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface Warranty {
  duration: string; // e.g., '6 months', '1 year'
  type?: string; // e.g., 'Manufacturer', 'Seller'
  description?: string;
}

export interface ReturnPolicy {
  isReturnable: boolean;
  returnWindowDays?: number; // e.g., 10, 30
  returnCharges?: string; // e.g., 'Free returns', '₹50 restocking fee'
  conditions?: string; // e.g., 'Product must be unused and in original packaging'
  returnMethod?: string; // e.g., 'Pickup', 'Drop-off', etc.
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
  offers?: Offer[];
  warranty?: Warranty;
  returnPolicy?: ReturnPolicy;
  isFeatured: boolean;
  isPublished: boolean;
}
