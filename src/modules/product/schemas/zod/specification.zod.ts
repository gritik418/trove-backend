import { z } from 'zod';

const SpecificationItemSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export const SpecificationsSchema = z.object({
  name: z.string(),
  specifications: z.array(SpecificationItemSchema),
});

export type SpecificationItem = z.infer<typeof SpecificationItemSchema>;
export type SpecificationGroup = z.infer<typeof SpecificationsSchema>;
