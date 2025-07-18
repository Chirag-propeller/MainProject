// src/lib/validators/auth.schema.ts
import { z } from 'zod';

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
