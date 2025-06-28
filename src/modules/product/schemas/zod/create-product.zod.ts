import { z } from 'zod';
import { SpecificationsSchema } from './specification.zod';

export const CreateProductSchema = z
  .object({
    name: z.string().min(3),
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    brand: z.string().optional(),
    categories: z.array(z.string()),
    highlights: z.array(z.string()),
    size: z.string().optional(),
    color: z.string().optional(),
    specifications: z.array(SpecificationsSchema),
    price: z.number().positive(),
    sku: z.string().optional(),
    discountType: z.enum(['PERCENT', 'FIXED']).optional(),
    discountValue: z.number().optional(),
    stock: z.number().nonnegative().default(0),
    isFeatured: z.boolean().default(false),
    isPublished: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    const { discountType, discountValue } = data;

    if (
      (discountType && discountValue === undefined) ||
      (!discountType && discountValue !== undefined)
    ) {
      ctx.addIssue({
        path: ['discountValue'],
        code: z.ZodIssueCode.custom,
        message:
          'Both discountType and discountValue must be provided together.',
      });
    }

    if (discountType === 'PERCENT' && typeof discountValue === 'number') {
      if (discountValue < 1 || discountValue > 100) {
        ctx.addIssue({
          path: ['discountValue'],
          code: z.ZodIssueCode.too_big,
          maximum: 100,
          type: 'number',
          inclusive: true,
          message: 'Percent discount must be between 1 and 100.',
        });
      }
    }
  });

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
