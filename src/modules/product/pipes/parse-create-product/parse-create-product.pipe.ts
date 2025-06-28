import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import {
  CreateProductDto,
  CreateProductSchema,
} from 'src/modules/product/schemas/zod/create-product.zod';

@Injectable()
export class ParseCreateProductPipe implements PipeTransform {
  transform(value: any) {
    try {
      const parsed: CreateProductDto = {
        ...value,
        categories: this.parseArray(value.categories),
        highlights: this.parseArray(value.highlights),
        price: this.parseNumber(value.price),
        stock: this.parseNumber(value.stock),
        discountValue: this.parseOptionalNumber(value.discountValue),
        isFeatured: this.parseBoolean(value.isFeatured),
        isPublished: this.parseBoolean(value.isPublished),
        specifications: this.parseJsonArray(value.specifications),
      };

      return CreateProductSchema.parse(parsed);
    } catch (error) {
      throw new BadRequestException(error.message || 'Invalid product data');
    }
  }

  private parseArray(input: any): string[] {
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') return input.split(',').map((s) => s.trim());
    return [];
  }

  private parseNumber(input: any): number {
    const num = Number(input);
    if (isNaN(num)) throw new Error(`Invalid number: ${input}`);
    return num;
  }

  private parseOptionalNumber(input: any): number | undefined {
    if (input === undefined || input === null || input === '') return undefined;
    return this.parseNumber(input);
  }

  private parseBoolean(input: any): boolean {
    return input === 'true' || input === true;
  }

  private parseJsonArray(input: any): any[] {
    if (!input) return [];
    try {
      return typeof input === 'string' ? JSON.parse(input) : [];
    } catch {
      throw new Error('Invalid JSON in specifications');
    }
  }
}
