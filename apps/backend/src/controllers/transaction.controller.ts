import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TransactionService } from '../services/transaction.service';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError } from '../utils/errors';
import { ResponseFormatter } from '../utils/response';

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.transactionService.getAllTransactions(page, limit);

    ResponseFormatter.success({
      res,
      message: 'Transactions retrieved successfully',
      data: result.transactions,
      meta: result.pagination,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await this.transactionService.getTransactionById(id);

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    ResponseFormatter.success({
      res,
      message: 'Transaction retrieved successfully',
      data: transaction,
    });
  });

  getByAccountId = asyncHandler(async (req: Request, res: Response) => {
    const { accountId } = req.params;
    const transactions = await this.transactionService.getTransactionsByAccountId(accountId);

    ResponseFormatter.success({
      res,
      message: 'Account transactions retrieved successfully',
      data: transactions,
    });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const { accountId, type, amount, transactionDate, monthsDuration, notes } = req.body;

    const transaction = await this.transactionService.createTransaction({
      accountId: BigInt(accountId),
      type,
      amount,
      transactionDate: new Date(transactionDate),
      monthsDuration,
      notes,
    });

    ResponseFormatter.success({
      res,
      statusCode: StatusCodes.CREATED,
      message: 'Transaction created successfully',
      data: transaction,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { type, amount, transactionDate, monthsDuration, notes } = req.body;

    const updateData: any = {};
    if (type !== undefined) updateData.type = type;
    if (amount !== undefined) updateData.amount = amount;
    if (transactionDate !== undefined) updateData.transactionDate = new Date(transactionDate);
    if (monthsDuration !== undefined) updateData.monthsDuration = monthsDuration;
    if (notes !== undefined) updateData.notes = notes;

    const transaction = await this.transactionService.updateTransaction(id, updateData);

    ResponseFormatter.success({
      res,
      message: 'Transaction updated successfully',
      data: transaction,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.transactionService.deleteTransaction(id);

    ResponseFormatter.success({
      res,
      message: 'Transaction deleted successfully',
      data: null,
    });
  });
}
