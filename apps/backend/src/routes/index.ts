import { Router } from 'express';
import customerRoutes from './customer.routes';
import depositoTypeRoutes from './depositoType.routes';

const router = Router();

router.use('/customers', customerRoutes);
router.use('/deposito-types', depositoTypeRoutes);

export default router;
