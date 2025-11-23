import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { ResponseFormatter } from './utils/response';

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req: Request, res: Response) => {
  ResponseFormatter.success({
    res,
    message: 'Bank Saving System API is running',
    data: {
      timestamp: new Date().toISOString(),
    },
  });
});

app.get('/api/v1', (req: Request, res: Response) => {
  ResponseFormatter.success({
    res,
    message: 'Bank Saving System API v1',
    data: {
      version: '1.0.0',
      endpoints: {
        customers: '/api/v1/customers',
        depositoTypes: '/api/v1/deposito-types',
        accounts: '/api/v1/accounts',
        transactions: '/api/v1/transactions',
      },
    },
  });
});

app.use('/api/v1', routes);

app.use((req: Request, res: Response) => {
  ResponseFormatter.error({
    res,
    statusCode: StatusCodes.NOT_FOUND,
    message: `Cannot ${req.method} ${req.path}`,
  });
});

app.use(errorHandler);

export default app;
