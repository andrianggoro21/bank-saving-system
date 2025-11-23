import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { validate } from '../middleware/validate';
import {
  createTransactionSchema,
  updateTransactionSchema,
  getTransactionByIdSchema,
  getTransactionsByAccountIdSchema,
  deleteTransactionSchema,
} from '../schemas/transaction.schema';

const router = Router();
const transactionController = new TransactionController();

router.get('/', transactionController.getAll);
router.get('/:id', validate(getTransactionByIdSchema), transactionController.getById);
router.get('/account/:accountId', validate(getTransactionsByAccountIdSchema), transactionController.getByAccountId);
router.post('/', validate(createTransactionSchema), transactionController.create);
router.put('/:id', validate(updateTransactionSchema), transactionController.update);
router.delete('/:id', validate(deleteTransactionSchema), transactionController.delete);

export default router;
