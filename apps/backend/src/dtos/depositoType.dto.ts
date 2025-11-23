import { Decimal } from '@prisma/client/runtime/library';

export interface CreateDepositoTypeDTO {
  name: string;
  yearlyReturn: number | Decimal;
}

export interface UpdateDepositoTypeDTO {
  name?: string;
  yearlyReturn?: number | Decimal;
}
