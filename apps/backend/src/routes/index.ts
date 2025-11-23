import { Router } from 'express';
import customerRoutes from './customer.routes';
import depositoTypeRoutes from './depositoType.routes';
import accountRoutes from './account.routes';

const router = Router();

router.use('/customers', customerRoutes);
router.use('/deposito-types', depositoTypeRoutes);
router.use('/accounts', accountRoutes);

export default router;
