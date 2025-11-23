import { CustomerRepository } from '../repositories/customer.repository';
import { Customer } from '@prisma/client';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dtos/customer.dto';
import { NotFoundError, ConflictError } from '../utils/errors';

export class CustomerService {
  private customerRepository: CustomerRepository;

  constructor() {
    this.customerRepository = new CustomerRepository();
  }

  async getAllCustomers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [customers, total] = await Promise.all([
      this.customerRepository.findAll(skip, limit),
      this.customerRepository.count(),
    ]);

    return {
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    return this.customerRepository.findById(BigInt(id));
  }

  async createCustomer(data: CreateCustomerDTO): Promise<Customer> {
    const existingCustomer = await this.customerRepository.findByEmail(data.email);
    if (existingCustomer) {
      throw new ConflictError('Email already exists');
    }

    return this.customerRepository.create(data);
  }

  async updateCustomer(id: string, data: UpdateCustomerDTO): Promise<Customer> {
    const customer = await this.customerRepository.findById(BigInt(id));
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    if (data.email && data.email !== customer.email) {
      const existingCustomer = await this.customerRepository.findByEmail(data.email);
      if (existingCustomer) {
        throw new ConflictError('Email already exists');
      }
    }

    return this.customerRepository.update(BigInt(id), data);
  }

  async deleteCustomer(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findById(BigInt(id));
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    return this.customerRepository.delete(BigInt(id));
  }
}
