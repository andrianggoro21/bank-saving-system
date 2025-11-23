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
