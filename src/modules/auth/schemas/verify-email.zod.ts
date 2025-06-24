import { z } from 'zod';

export const VerifyEmailSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  token: z.string().min(1, 'Verification token is required'),
});

export type VerifyEmailSchemaType = z.infer<typeof VerifyEmailSchema>;
