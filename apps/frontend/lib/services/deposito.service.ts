import { api } from '../api';
import {
  DepositoType,
  CreateDepositoTypeDTO,
  UpdateDepositoTypeDTO,
  PaginationParams,
} from '../types';

export const depositoService = {
  getAll: async (params?: PaginationParams) => {
    return api.get<DepositoType[]>('/deposito-types', {
      params: params as Record<string, string | number | undefined>
    });
  },

  getById: async (id: string) => {
    return api.get<DepositoType>(`/deposito-types/${id}`);
  },

  create: async (data: CreateDepositoTypeDTO) => {
    return api.post<DepositoType>('/deposito-types', data);
  },

  update: async (id: string, data: UpdateDepositoTypeDTO) => {
    return api.put<DepositoType>(`/deposito-types/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete<DepositoType>(`/deposito-types/${id}`);
  },
};
