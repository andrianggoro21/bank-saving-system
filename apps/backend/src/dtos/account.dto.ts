import { Decimal } from '@prisma/client/runtime/library';

export interface CreateAccountDTO {
  customerId: bigint;
  depositoTypeId: bigint;
  balance?: number | Decimal;
}

export interface UpdateAccountDTO {
  customerId?: bigint;
  depositoTypeId?: bigint;
  balance?: number | Decimal;
}
