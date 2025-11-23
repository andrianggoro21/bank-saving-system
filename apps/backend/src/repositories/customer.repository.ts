import prisma from '../config/database';
import { Customer, Prisma } from '@prisma/client';

export class CustomerRepository {
  async findAll(skip?: number, take?: number): Promise<Customer[]> {
    return prisma.customer.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(): Promise<number> {
    return prisma.customer.count();
  }

  async findById(id: bigint): Promise<Customer | null> {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        accounts: {
          include: {
            depositoType: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return prisma.customer.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.CustomerCreateInput): Promise<Customer> {
    return prisma.customer.create({
      data,
    });
  }

  async update(id: bigint, data: Prisma.CustomerUpdateInput): Promise<Customer> {
    return prisma.customer.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint): Promise<Customer> {
    return prisma.customer.delete({
      where: { id },
    });
  }
}
