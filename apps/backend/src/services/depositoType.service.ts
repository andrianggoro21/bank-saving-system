import { DepositoTypeRepository } from '../repositories/depositoType.repository';
import { DepositoType } from '@prisma/client';
import { CreateDepositoTypeDTO, UpdateDepositoTypeDTO } from '../dtos/depositoType.dto';
import { NotFoundError, ConflictError } from '../utils/errors';

export class DepositoTypeService {
  private depositoTypeRepository: DepositoTypeRepository;

  constructor() {
    this.depositoTypeRepository = new DepositoTypeRepository();
  }

  async getAllDepositoTypes(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [depositoTypes, total] = await Promise.all([
      this.depositoTypeRepository.findAll(skip, limit),
      this.depositoTypeRepository.count(),
    ]);

    return {
      depositoTypes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getDepositoTypeById(id: string): Promise<DepositoType | null> {
    return this.depositoTypeRepository.findById(BigInt(id));
  }

  async createDepositoType(data: CreateDepositoTypeDTO): Promise<DepositoType> {
    const existingDepositoType = await this.depositoTypeRepository.findByName(data.name);
    if (existingDepositoType) {
      throw new ConflictError('Deposito type name already exists');
    }

    return this.depositoTypeRepository.create(data);
  }

  async updateDepositoType(id: string, data: UpdateDepositoTypeDTO): Promise<DepositoType> {
    const depositoType = await this.depositoTypeRepository.findById(BigInt(id));
    if (!depositoType) {
      throw new NotFoundError('Deposito type not found');
    }

    if (data.name && data.name !== depositoType.name) {
      const existingDepositoType = await this.depositoTypeRepository.findByName(data.name);
      if (existingDepositoType) {
        throw new ConflictError('Deposito type name already exists');
      }
    }

    return this.depositoTypeRepository.update(BigInt(id), data);
  }

  async deleteDepositoType(id: string): Promise<DepositoType> {
    const depositoType = await this.depositoTypeRepository.findById(BigInt(id));
    if (!depositoType) {
      throw new NotFoundError('Deposito type not found');
    }

    return this.depositoTypeRepository.delete(BigInt(id));
  }
}
