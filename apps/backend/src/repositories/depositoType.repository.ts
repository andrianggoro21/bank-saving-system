import { DepositoType, Prisma } from '@prisma/client';
import prisma from '../config/database';

export class DepositoTypeRepository {
  async findAll(skip: number, limit: number): Promise<DepositoType[]> {
    return prisma.depositoType.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(): Promise<number> {
    return prisma.depositoType.count();
  }

  async findById(id: bigint): Promise<DepositoType | null> {
    return prisma.depositoType.findUnique({
      where: { id },
      include: {
        accounts: {
          include: {
            customer: true,
          },
        },
      },
    });
  }

  async findByName(name: string): Promise<DepositoType | null> {
    return prisma.depositoType.findUnique({
      where: { name },
    });
  }

  async create(data: Prisma.DepositoTypeCreateInput): Promise<DepositoType> {
    return prisma.depositoType.create({
      data,
    });
  }

  async update(id: bigint, data: Prisma.DepositoTypeUpdateInput): Promise<DepositoType> {
    return prisma.depositoType.update({
      where: { id },
      data,
    });
  }

  async delete(id: bigint): Promise<DepositoType> {
    return prisma.depositoType.delete({
      where: { id },
    });
  }
}
