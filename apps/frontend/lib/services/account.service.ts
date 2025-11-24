import { api } from '../api';
import {
  Account,
  CreateAccountDTO,
  UpdateAccountDTO,
  PaginationParams,
} from '../types';

export const accountService = {
  getAll: async (params?: PaginationParams) => {
    return api.get<Account[]>('/accounts', {
      params: params as Record<string, string | number | undefined>
    });
  },

  getById: async (id: string) => {
    return api.get<Account>(`/accounts/${id}`);
  },

  getByCustomerId: async (customerId: string) => {
    return api.get<Account[]>(`/accounts/customer/${customerId}`);
  },

  create: async (data: CreateAccountDTO) => {
    return api.post<Account>('/accounts', data);
  },

  update: async (id: string, data: UpdateAccountDTO) => {
    return api.put<Account>(`/accounts/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete<Account>(`/accounts/${id}`);
  },
};
