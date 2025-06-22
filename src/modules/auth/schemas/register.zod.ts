import { z } from 'zod';

export const RegisterSchema = z
  .object({
    name: z.string().min(3).max(30),
    email: z.string().email(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(20, 'Password must be at most 20 characters')
      .regex(/(?=.*[A-Z])(?=.*\d)/, {
        message:
          'Password must contain at least one uppercase letter and one number',
      }),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Confirm Password must match Password',
      });
    }
  });

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
