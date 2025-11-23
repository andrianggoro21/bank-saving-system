import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { ResponseFormatter } from '../utils/response';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        ResponseFormatter.error({
          res,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'Validation failed',
          errors: errorMessages,
        });
        return;
      }

      next(error);
    }
  };
};
