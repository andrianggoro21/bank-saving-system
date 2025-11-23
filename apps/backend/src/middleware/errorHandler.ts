import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/errors';
import { ResponseFormatter } from '../utils/response';

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof AppError) {
    ResponseFormatter.error({
      res,
      statusCode: error.statusCode,
      message: error.message,
    });
    return;
  }

  console.error('Unexpected error:', error);
  ResponseFormatter.error({
    res,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  });
};
