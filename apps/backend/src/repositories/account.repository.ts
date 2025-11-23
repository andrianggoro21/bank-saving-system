import { Account, Prisma } from '@prisma/client';
import prisma from '../config/database';

export class AccountRepository {
  async findAll(skip: number, limit: number): Promise<Account[]> {
    return prisma.account.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        depositoType: true,
      },
    });
  }

  async count(): Promise<number> {
    return prisma.account.count();
  }

  async findById(id: bigint): Promise<Account | null> {
    return prisma.account.findUnique({
      where: { id },
      include: {
        customer: true,
        depositoType: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async findByCustomerId(customerId: bigint): Promise<Account[]> {
    return prisma.account.findMany({
      where: { customerId },
      include: {
        depositoType: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async create(data: Prisma.AccountCreateInput): Promise<Account> {
    return prisma.account.create({
      data,
      include: {
        customer: true,
        depositoType: true,
      },
    });
  }

  async update(id: bigint, data: Prisma.AccountUpdateInput): Promise<Account> {
    return prisma.account.update({
      where: { id },
      data,
      include: {
        customer: true,
        depositoType: true,
      },
    });
  }

  async delete(id: bigint): Promise<Account> {
    return prisma.account.delete({
      where: { id },
    });
  }
}
