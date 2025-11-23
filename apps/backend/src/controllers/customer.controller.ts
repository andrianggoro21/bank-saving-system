import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { CustomerService } from '../services/customer.service';
import { asyncHandler } from '../utils/asyncHandler';
import { NotFoundError } from '../utils/errors';
import { ResponseFormatter } from '../utils/response';

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  getAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await this.customerService.getAllCustomers(page, limit);

    ResponseFormatter.success({
      res,
      message: 'Customers retrieved successfully',
      data: result.customers,
      meta: result.pagination,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const customer = await this.customerService.getCustomerById(id);

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    ResponseFormatter.success({
      res,
      message: 'Customer retrieved successfully',
      data: customer,
    });
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, address } = req.body;

    const customer = await this.customerService.createCustomer({
      name,
      email,
      phone,
      address,
    });

    ResponseFormatter.success({
      res,
      statusCode: StatusCodes.CREATED,
      message: 'Customer created successfully',
      data: customer,
    });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const customer = await this.customerService.updateCustomer(id, {
      name,
      email,
      phone,
      address,
    });

    ResponseFormatter.success({
      res,
      message: 'Customer updated successfully',
      data: customer,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.customerService.deleteCustomer(id);

    ResponseFormatter.success({
      res,
      message: 'Customer deleted successfully',
      data: null,
    });
  });
}
