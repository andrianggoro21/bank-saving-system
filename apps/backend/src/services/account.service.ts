import { AccountRepository } from '../repositories/account.repository';
import { CustomerRepository } from '../repositories/customer.repository';
import { DepositoTypeRepository } from '../repositories/depositoType.repository';
import { Account } from '@prisma/client';
import { CreateAccountDTO, UpdateAccountDTO } from '../dtos/account.dto';
import { NotFoundError } from '../utils/errors';

export class AccountService {
  private accountRepository: AccountRepository;
  private customerRepository: CustomerRepository;
  private depositoTypeRepository: DepositoTypeRepository;

  constructor() {
    this.accountRepository = new AccountRepository();
    this.customerRepository = new CustomerRepository();
    this.depositoTypeRepository = new DepositoTypeRepository();
  }

  async getAllAccounts(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [accounts, total] = await Promise.all([
      this.accountRepository.findAll(skip, limit),
      this.accountRepository.count(),
    ]);

    return {
      accounts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAccountById(id: string): Promise<Account | null> {
    return this.accountRepository.findById(BigInt(id));
  }

  async getAccountsByCustomerId(customerId: string): Promise<Account[]> {
    return this.accountRepository.findByCustomerId(BigInt(customerId));
  }

  async createAccount(data: CreateAccountDTO): Promise<Account> {
    const customer = await this.customerRepository.findById(data.customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const depositoType = await this.depositoTypeRepository.findById(data.depositoTypeId);
    if (!depositoType) {
      throw new NotFoundError('Deposito type not found');
    }

    return this.accountRepository.create({
      customer: {
        connect: { id: data.customerId },
      },
      depositoType: {
        connect: { id: data.depositoTypeId },
      },
      balance: data.balance || 0,
    });
  }

  async updateAccount(id: string, data: UpdateAccountDTO): Promise<Account> {
    const account = await this.accountRepository.findById(BigInt(id));
    if (!account) {
      throw new NotFoundError('Account not found');
    }

    const updateData: any = {};

    if (data.customerId !== undefined) {
      const customer = await this.customerRepository.findById(data.customerId);
      if (!customer) {
        throw new NotFoundError('Customer not found');
      }
      updateData.customer = { connect: { id: data.customerId } };
    }

    if (data.depositoTypeId !== undefined) {
      const depositoType = await this.depositoTypeRepository.findById(data.depositoTypeId);
      if (!depositoType) {
        throw new NotFoundError('Deposito type not found');
      }
      updateData.depositoType = { connect: { id: data.depositoTypeId } };
    }

    if (data.balance !== undefined) {
      updateData.balance = data.balance;
    }

    return this.accountRepository.update(BigInt(id), updateData);
  }

  async deleteAccount(id: string): Promise<Account> {
    const account = await this.accountRepository.findById(BigInt(id));
    if (!account) {
      throw new NotFoundError('Account not found');
    }

    return this.accountRepository.delete(BigInt(id));
  }
}
