import { api } from '../api';
import {
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO,
  PaginationParams,
} from '../types';

export const customerService = {
  getAll: async (params?: PaginationParams) => {
    return api.get<Customer[]>('/customers', {
      params: params as Record<string, string | number | undefined>
    });
  },

  getById: async (id: string) => {
    return api.get<Customer>(`/customers/${id}`);
  },

  create: async (data: CreateCustomerDTO) => {
    return api.post<Customer>('/customers', data);
  },

  update: async (id: string, data: UpdateCustomerDTO) => {
    return api.put<Customer>(`/customers/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete<Customer>(`/customers/${id}`);
  },
};
