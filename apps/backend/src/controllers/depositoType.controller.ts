import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DepositoTypeService } from '../services/depositoType.service';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError } from '../utils/errors';
import { ResponseFormatter } from '../utils/response';

export class DepositoTypeController {
  private depositoTypeService: DepositoTypeService;

  constructor() {
    this.depositoTypeService = new DepositoTypeService();
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.depositoTypeService.getAllDepositoTypes(page, limit);

    ResponseFormatter.success({
      res,
      message: 'Deposito types retrieved successfully',
      data: result.depositoTypes,
      meta: result.pagination,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const depositoType = await this.depositoTypeService.getDepositoTypeById(id);

    if (!depositoType) {
      throw new NotFoundError('Deposito type not found');
    }

    ResponseFormatter.success({
      res,
      message: 'Deposito type retrieved successfully',
      data: depositoType,
    });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const { name, yearlyReturn } = req.body;

    const depositoType = await this.depositoTypeService.createDepositoType({
      name,
      yearlyReturn,
    });

    ResponseFormatter.success({
      res,
      statusCode: StatusCodes.CREATED,
      message: 'Deposito type created successfully',
      data: depositoType,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, yearlyReturn } = req.body;

    const depositoType = await this.depositoTypeService.updateDepositoType(id, {
      name,
      yearlyReturn,
    });

    ResponseFormatter.success({
      res,
      message: 'Deposito type updated successfully',
      data: depositoType,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.depositoTypeService.deleteDepositoType(id);

    ResponseFormatter.success({
      res,
      message: 'Deposito type deleted successfully',
      data: null,
    });
  });
}
