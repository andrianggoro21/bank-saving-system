import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AccountService } from '../services/account.service';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError } from '../utils/errors';
import { ResponseFormatter } from '../utils/response';

export class AccountController {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.accountService.getAllAccounts(page, limit);

    ResponseFormatter.success({
      res,
      message: 'Accounts retrieved successfully',
      data: result.accounts,
      meta: result.pagination,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const account = await this.accountService.getAccountById(id);

    if (!account) {
      throw new NotFoundError('Account not found');
    }

    ResponseFormatter.success({
      res,
      message: 'Account retrieved successfully',
      data: account,
    });
  });

  getByCustomerId = asyncHandler(async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const accounts = await this.accountService.getAccountsByCustomerId(customerId);

    ResponseFormatter.success({
      res,
      message: 'Customer accounts retrieved successfully',
      data: accounts,
    });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const { customerId, depositoTypeId, balance } = req.body;

    const account = await this.accountService.createAccount({
      customerId: BigInt(customerId),
      depositoTypeId: BigInt(depositoTypeId),
      balance,
    });

    ResponseFormatter.success({
      res,
      statusCode: StatusCodes.CREATED,
      message: 'Account created successfully',
      data: account,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { customerId, depositoTypeId, balance } = req.body;

    const updateData: any = {};
    if (customerId !== undefined) updateData.customerId = BigInt(customerId);
    if (depositoTypeId !== undefined) updateData.depositoTypeId = BigInt(depositoTypeId);
    if (balance !== undefined) updateData.balance = balance;

    const account = await this.accountService.updateAccount(id, updateData);

    ResponseFormatter.success({
      res,
      message: 'Account updated successfully',
      data: account,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.accountService.deleteAccount(id);

    ResponseFormatter.success({
      res,
      message: 'Account deleted successfully',
      data: null,
    });
  });
}
