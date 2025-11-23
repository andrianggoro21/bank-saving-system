import { Router } from 'express';
import customerRoutes from './customer.routes';
import depositoTypeRoutes from './depositoType.routes';
import accountRoutes from './account.routes';
import transactionRoutes from './transaction.routes';

const router = Router();

router.use('/customers', customerRoutes);
router.use('/deposito-types', depositoTypeRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);

export default router;
