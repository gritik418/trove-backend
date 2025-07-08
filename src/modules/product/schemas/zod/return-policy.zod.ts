import { z } from 'zod';

export const ReturnPolicySchema = z.object({
  isReturnable: z.boolean(),
  returnWindowDays: z.number().optional(),
  returnCharges: z.string().optional(),
  conditions: z.string().optional(),
  returnMethod: z.string().optional(),
});
