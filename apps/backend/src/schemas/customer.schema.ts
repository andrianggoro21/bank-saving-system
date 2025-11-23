import { z } from 'zod';

export const createCustomerSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Name is required' })
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(100, { message: 'Name must not exceed 100 characters' }),
    email: z
      .string({ message: 'Email is required' })
      .email({ message: 'Invalid email format' }),
    phone: z
      .string({ message: 'Phone is required' })
      .min(10, { message: 'Phone number must be at least 10 characters' })
      .max(15, { message: 'Phone number must not exceed 15 characters' }),
    address: z
      .string({ message: 'Address is required' })
      .min(5, { message: 'Address must be at least 5 characters' })
      .max(200, { message: 'Address must not exceed 200 characters' }),
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(100, { message: 'Name must not exceed 100 characters' })
      .optional(),
    email: z.string().email({ message: 'Invalid email format' }).optional(),
    phone: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 characters' })
      .max(15, { message: 'Phone number must not exceed 15 characters' })
      .optional(),
    address: z
      .string()
      .min(5, { message: 'Address must be at least 5 characters' })
      .max(200, { message: 'Address must not exceed 200 characters' })
      .optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'Invalid customer ID format' }),
  }),
});

export const getCustomerByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'Invalid customer ID format' }),
  }),
});

export const deleteCustomerSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, { message: 'Invalid customer ID format' }),
  }),
});
