export interface VariantSize {
  size: string;
  slug: string;
  stock: number;
  isPublished: boolean;
}

export interface VariantColorSize {
  color: string;
  thumbnail?: string;
  sizes: VariantSize[];
}

export interface VariantColor {
  color: string;
  thumbnail?: string;
  slug: string;
  stock: number;
  isPublished: boolean;
}

export interface VariantSize {
  size: string;
  thumbnail?: string;
  slug: string;
  stock: number;
  isPublished: boolean;
}

export type Variants = VariantColorSize[] | VariantColor[] | VariantSize[] | [];

export type VariantType = 'color-size' | 'color' | 'size' | 'none';
