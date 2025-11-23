import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { validate } from '../middleware/validate';
import {
  createCustomerSchema,
  updateCustomerSchema,
  getCustomerByIdSchema,
  deleteCustomerSchema,
} from '../schemas/customer.schema';

const router = Router();
const customerController = new CustomerController();

router.get('/', customerController.getAll);
router.get('/:id', validate(getCustomerByIdSchema), customerController.getById);
router.post('/', validate(createCustomerSchema), customerController.create);
router.put('/:id', validate(updateCustomerSchema), customerController.update);
router.delete('/:id', validate(deleteCustomerSchema), customerController.delete);

export default router;
