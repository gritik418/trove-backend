import { z } from 'zod';

export const WarrantySchema = z.object({
  duration: z.string(),
  type: z.string().optional(),
  description: z.string().optional(),
});
