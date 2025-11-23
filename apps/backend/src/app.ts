import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Bank Saving System API is running',
    timestamp: new Date().toISOString()
  });
});

// API v1 routes
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    message: 'Bank Saving System API v1',
    version: '1.0.0',
    endpoints: {
      customers: '/api/v1/customers',
      depositoTypes: '/api/v1/deposito-types',
      accounts: '/api/v1/accounts',
      transactions: '/api/v1/transactions'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`
    }
  });
});

export default app;
