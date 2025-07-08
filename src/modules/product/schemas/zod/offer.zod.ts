import { z } from 'zod';

export const OfferSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  terms: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  isActive: z.boolean(),
});
