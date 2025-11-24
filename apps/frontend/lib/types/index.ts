export interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: Array<{
    field: string;
    message: string;
  }>;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDTO {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateCustomerDTO {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface DepositoType {
  id: string;
  name: string;
  yearlyReturn: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepositoTypeDTO {
  name: string;
  yearlyReturn: number;
}

export interface UpdateDepositoTypeDTO {
  name?: string;
  yearlyReturn?: number;
}

export interface Account {
  id: string;
  customerId: string;
  depositoTypeId: string;
  balance: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  depositoType?: DepositoType;
  transactions?: Transaction[];
}

export interface CreateAccountDTO {
  customerId: string;
  depositoTypeId: string;
  balance?: number;
}

export interface UpdateAccountDTO {
  customerId?: string;
  depositoTypeId?: string;
  balance?: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: string;
  amount: string;
  transactionDate: string;
  balanceBefore: string;
  balanceAfter: string;
  monthsDuration: string | null;
  interestEarned: string | null;
  notes: string | null;
  createdAt: string;
  account?: Account;
}

export interface CreateTransactionDTO {
  accountId: string;
  type: 'deposit' | 'withdraw' | 'interest';
  amount: number;
  transactionDate: string;
  monthsDuration?: number;
  notes?: string;
}

export interface UpdateTransactionDTO {
  type?: string;
  amount?: number;
  transactionDate?: string;
  monthsDuration?: number;
  notes?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
