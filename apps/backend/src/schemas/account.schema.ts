import { z } from 'zod';

export const createAccountSchema = z.object({
  body: z.object({
    customerId: z
      .string({ message: 'Customer ID is required' })
      .regex(/^\d+$/, { message: 'Invalid customer ID format' }),
    depositoTypeId: z
      .string({ message: 'Deposito type ID is required' })
      .regex(/^\d+$/, { message: 'Invalid deposito type ID format' }),
    balance: z
      .number()
      .min(0, { message: 'Balance must be at least 0' })
      .optional(),
  }),
});

export const updateAccountSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'ID is required' })
      .regex(/^\d+$/, { message: 'Invalid account ID format' }),
  }),
  body: z.object({
    customerId: z
      .string()
      .regex(/^\d+$/, { message: 'Invalid customer ID format' })
      .optional(),
    depositoTypeId: z
      .string()
      .regex(/^\d+$/, { message: 'Invalid deposito type ID format' })
      .optional(),
    balance: z
      .number()
      .min(0, { message: 'Balance must be at least 0' })
      .optional(),
  }),
});

export const getAccountByIdSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'ID is required' })
      .regex(/^\d+$/, { message: 'Invalid account ID format' }),
  }),
});

export const getAccountsByCustomerIdSchema = z.object({
  params: z.object({
    customerId: z
      .string({ message: 'Customer ID is required' })
      .regex(/^\d+$/, { message: 'Invalid customer ID format' }),
  }),
});

export const deleteAccountSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'ID is required' })
      .regex(/^\d+$/, { message: 'Invalid account ID format' }),
  }),
});
