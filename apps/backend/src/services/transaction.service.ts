import { TransactionRepository } from '../repositories/transaction.repository';
import { AccountRepository } from '../repositories/account.repository';
import { Transaction, Prisma } from '@prisma/client';
import { CreateTransactionDTO, UpdateTransactionDTO } from '../dtos/transaction.dto';
import { NotFoundError, ValidationError } from '../utils/errors';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private accountRepository: AccountRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.accountRepository = new AccountRepository();
  }

  async getAllTransactions(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      this.transactionRepository.findAll(skip, limit),
      this.transactionRepository.count(),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findById(BigInt(id));
  }

  async getTransactionsByAccountId(accountId: string): Promise<Transaction[]> {
    return this.transactionRepository.findByAccountId(BigInt(accountId));
  }

  async createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
    const account = await this.accountRepository.findById(data.accountId);
    if (!account) {
      throw new NotFoundError('Account not found');
    }

    const accountWithType = account as typeof account & {
      depositoType: { yearlyReturn: Decimal };
    };

    const currentBalance = new Decimal(account.balance.toString());
    const amount = new Decimal(data.amount.toString());

    let balanceBefore = currentBalance;
    let balanceAfter = currentBalance;
    let interestEarned: Decimal | null = null;

    if (data.type.toLowerCase() === 'deposit') {
      balanceAfter = currentBalance.plus(amount);
    } else if (data.type.toLowerCase() === 'withdraw') {
      if (currentBalance.lessThan(amount)) {
        throw new ValidationError('Insufficient balance');
      }
      balanceAfter = currentBalance.minus(amount);
    } else if (data.type.toLowerCase() === 'interest') {
      if (data.monthsDuration) {
        const yearlyReturn = new Decimal(accountWithType.depositoType.yearlyReturn.toString());
        const monthsDuration = new Decimal(data.monthsDuration.toString());

        interestEarned = currentBalance
          .times(yearlyReturn)
          .dividedBy(100)
          .times(monthsDuration)
          .dividedBy(12);

        balanceAfter = currentBalance.plus(interestEarned);
      } else {
        throw new ValidationError('Months duration is required for interest transactions');
      }
    }

    const transaction = await this.transactionRepository.create({
      account: {
        connect: { id: data.accountId },
      },
      type: data.type,
      amount: data.amount,
      transactionDate: data.transactionDate,
      balanceBefore: balanceBefore,
      balanceAfter: balanceAfter,
      monthsDuration: data.monthsDuration || null,
      interestEarned: interestEarned,
      notes: data.notes || null,
    });

    await this.accountRepository.update(data.accountId, {
      balance: balanceAfter,
    });

    return transaction;
  }

  async updateTransaction(id: string, data: UpdateTransactionDTO): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(BigInt(id));
    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    const updateData: any = {};
    if (data.type !== undefined) updateData.type = data.type;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.transactionDate !== undefined) updateData.transactionDate = data.transactionDate;
    if (data.monthsDuration !== undefined) updateData.monthsDuration = data.monthsDuration;
    if (data.notes !== undefined) updateData.notes = data.notes;

    return this.transactionRepository.update(BigInt(id), updateData);
  }

  async deleteTransaction(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findById(BigInt(id));
    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    return this.transactionRepository.delete(BigInt(id));
  }
}
