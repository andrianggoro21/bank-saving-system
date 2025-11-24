import { api } from '../api';
import {
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO,
  PaginationParams,
} from '../types';

export const transactionService = {
  getAll: async (params?: PaginationParams) => {
    return api.get<Transaction[]>('/transactions', {
      params: params as Record<string, string | number | undefined>
    });
  },

  getById: async (id: string) => {
    return api.get<Transaction>(`/transactions/${id}`);
  },

  getByAccountId: async (accountId: string) => {
    return api.get<Transaction[]>(`/transactions/account/${accountId}`);
  },

  create: async (data: CreateTransactionDTO) => {
    return api.post<Transaction>('/transactions', data);
  },

  update: async (id: string, data: UpdateTransactionDTO) => {
    return api.put<Transaction>(`/transactions/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete<Transaction>(`/transactions/${id}`);
  },
};
