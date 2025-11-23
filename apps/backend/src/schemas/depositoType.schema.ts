import { z } from 'zod';

export const createDepositoTypeSchema = z.object({
  body: z.object({
    name: z
      .string({ message: 'Name is required' })
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(100, { message: 'Name must not exceed 100 characters' }),
    yearlyReturn: z
      .number({ message: 'Yearly return is required' })
      .min(0, { message: 'Yearly return must be at least 0' })
      .max(100, { message: 'Yearly return must not exceed 100' }),
  }),
});

export const updateDepositoTypeSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'ID is required' })
      .regex(/^\d+$/, { message: 'Invalid deposito type ID format' }),
  }),
  body: z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(100, { message: 'Name must not exceed 100 characters' })
      .optional(),
    yearlyReturn: z
      .number()
      .min(0, { message: 'Yearly return must be at least 0' })
      .max(100, { message: 'Yearly return must not exceed 100' })
      .optional(),
  }),
});

export const getDepositoTypeByIdSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'ID is required' })
      .regex(/^\d+$/, { message: 'Invalid deposito type ID format' }),
  }),
});

export const deleteDepositoTypeSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'ID is required' })
      .regex(/^\d+$/, { message: 'Invalid deposito type ID format' }),
  }),
});
