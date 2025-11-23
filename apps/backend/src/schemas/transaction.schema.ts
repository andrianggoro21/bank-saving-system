import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    accountId: z
      .string({ message: 'Account ID is required' })
      .regex(/^\d+$/, { message: 'Invalid account ID format' }),
    type: z
      .string({ message: 'Transaction type is required' })
      .min(1, { message: 'Transaction type cannot be empty' })
      .max(20, { message: 'Transaction type must not exceed 20 characters' }),
    amount: z
      .number({ message: 'Amount is required' })
      .positive({ message: 'Amount must be positive' }),
    transactionDate: z
      .string({ message: 'Transaction date is required' })
      .datetime({ message: 'Invalid transaction date format' })
      .or(z.date()),
    monthsDuration: z
      .number()
      .positive({ message: 'Months duration must be positive' })
      .optional(),
    notes: z
      .string()
      .max(500, { message: 'Notes must not exceed 500 characters' })
      .optional(),
  }),
});

export const updateTransactionSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'ID is required' })
      .regex(/^\d+$/, { message: 'Invalid transaction ID format' }),
  }),
  body: z.object({
    type: z
      .string()
      .min(1, { message: 'Transaction type cannot be empty' })
      .max(20, { message: 'Transaction type must not exceed 20 characters' })
      .optional(),
    amount: z
      .number()
      .positive({ message: 'Amount must be positive' })
      .optional(),
    transactionDate: z
      .string()
      .datetime({ message: 'Invalid transaction date format' })
      .or(z.date())
      .optional(),
    monthsDuration: z
      .number()
      .positive({ message: 'Months duration must be positive' })
      .optional(),
    notes: z
      .string()
      .max(500, { message: 'Notes must not exceed 500 characters' })
      .optional(),
  }),
});

export const getTransactionByIdSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'ID is required' })
      .regex(/^\d+$/, { message: 'Invalid transaction ID format' }),
  }),
});

export const getTransactionsByAccountIdSchema = z.object({
  params: z.object({
    accountId: z
      .string({ message: 'Account ID is required' })
      .regex(/^\d+$/, { message: 'Invalid account ID format' }),
  }),
});

export const deleteTransactionSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'ID is required' })
      .regex(/^\d+$/, { message: 'Invalid transaction ID format' }),
  }),
});
