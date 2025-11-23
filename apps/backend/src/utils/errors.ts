import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || this.getDefaultCode(statusCode);
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  private getDefaultCode(statusCode: number): string {
    switch (statusCode) {
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
      case StatusCodes.UNPROCESSABLE_ENTITY:
        return 'VALIDATION_ERROR';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, StatusCodes.NOT_FOUND, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, StatusCodes.BAD_REQUEST, 'VALIDATION_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, StatusCodes.CONFLICT, 'CONFLICT');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED');
  }
}
