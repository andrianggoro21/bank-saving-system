import { Transaction, Prisma } from '@prisma/client';
import prisma from '../config/database';

export class TransactionRepository {
  async findAll(skip: number, limit: number): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        account: {
          include: {
            customer: true,
            depositoType: true,
          },
        },
      },
    });
  }

  async count(): Promise<number> {
    return prisma.transaction.count();
  }

  async findById(id: bigint): Promise<Transaction | null> {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        account: {
          include: {
            customer: true,
            depositoType: true,
          },
        },
      },
    });
  }

  async findByAccountId(accountId: bigint): Promise<Transaction[]> {
    return prisma.transaction.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.TransactionCreateInput): Promise<Transaction> {
    return prisma.transaction.create({
      data,
      include: {
        account: {
          include: {
            customer: true,
            depositoType: true,
          },
        },
      },
    });
  }

  async update(id: bigint, data: Prisma.TransactionUpdateInput): Promise<Transaction> {
    return prisma.transaction.update({
      where: { id },
      data,
      include: {
        account: {
          include: {
            customer: true,
            depositoType: true,
          },
        },
      },
    });
  }

  async delete(id: bigint): Promise<Transaction> {
    return prisma.transaction.delete({
      where: { id },
    });
  }
}
