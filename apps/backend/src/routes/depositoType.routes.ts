import { Router } from 'express';
import { DepositoTypeController } from '../controllers/depositoType.controller';
import { validate } from '../middleware/validate';
import {
  createDepositoTypeSchema,
  updateDepositoTypeSchema,
  getDepositoTypeByIdSchema,
  deleteDepositoTypeSchema,
} from '../schemas/depositoType.schema';

const router = Router();
const depositoTypeController = new DepositoTypeController();

router.get('/', depositoTypeController.getAll);
router.get('/:id', validate(getDepositoTypeByIdSchema), depositoTypeController.getById);
router.post('/', validate(createDepositoTypeSchema), depositoTypeController.create);
router.put('/:id', validate(updateDepositoTypeSchema), depositoTypeController.update);
router.delete('/:id', validate(deleteDepositoTypeSchema), depositoTypeController.delete);

export default router;
