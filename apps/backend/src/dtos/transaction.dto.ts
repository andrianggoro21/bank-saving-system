import { Decimal } from '@prisma/client/runtime/library';

export interface CreateTransactionDTO {
  accountId: bigint;
  type: string;
  amount: number | Decimal;
  transactionDate: Date;
  monthsDuration?: number | Decimal;
  notes?: string;
}

export interface UpdateTransactionDTO {
  type?: string;
  amount?: number | Decimal;
  transactionDate?: Date;
  monthsDuration?: number | Decimal;
  notes?: string;
}
