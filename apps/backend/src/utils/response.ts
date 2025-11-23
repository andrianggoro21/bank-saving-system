import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

interface SuccessResponseParams<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: any;
}

interface ErrorResponseParams {
  res: Response;
  statusCode?: number;
  message: string;
  errors?: any;
}

export class ResponseFormatter {
  static success<T>({
    res,
    statusCode = StatusCodes.OK,
    message = 'Success',
    data,
    meta,
  }: SuccessResponseParams<T>) {
    const response: any = {
      code: statusCode,
      status: this.getStatusText(statusCode),
      message,
    };

    if (data !== undefined) {
      response.data = data;
    }

    if (meta) {
      response.meta = meta;
    }

    return res.status(statusCode).json(response);
  }

  static error({
    res,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
    message,
    errors,
  }: ErrorResponseParams) {
    const response: any = {
      code: statusCode,
      status: this.getStatusText(statusCode),
      message,
    };

    if (errors) {
      response.error = errors;
    }

    return res.status(statusCode).json(response);
  }

  private static getStatusText(statusCode: number): string {
    switch (statusCode) {
      case StatusCodes.OK:
        return 'OK';
      case StatusCodes.CREATED:
        return 'CREATED';
      case StatusCodes.BAD_REQUEST:
        return 'BAD_REQUEST';
      case StatusCodes.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case StatusCodes.FORBIDDEN:
        return 'FORBIDDEN';
      case StatusCodes.NOT_FOUND:
        return 'NOT_FOUND';
      case StatusCodes.CONFLICT:
        return 'CONFLICT';
      case StatusCodes.INTERNAL_SERVER_ERROR:
        return 'INTERNAL_SERVER_ERROR';
      default:
        return 'UNKNOWN';
    }
  }
}
