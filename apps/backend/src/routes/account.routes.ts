import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';
import { validate } from '../middleware/validate';
import {
  createAccountSchema,
  updateAccountSchema,
  getAccountByIdSchema,
  getAccountsByCustomerIdSchema,
  deleteAccountSchema,
} from '../schemas/account.schema';

const router = Router();
const accountController = new AccountController();

router.get('/', accountController.getAll);
router.get('/:id', validate(getAccountByIdSchema), accountController.getById);
router.get('/customer/:customerId', validate(getAccountsByCustomerIdSchema), accountController.getByCustomerId);
router.post('/', validate(createAccountSchema), accountController.create);
router.put('/:id', validate(updateAccountSchema), accountController.update);
router.delete('/:id', validate(deleteAccountSchema), accountController.delete);

export default router;
