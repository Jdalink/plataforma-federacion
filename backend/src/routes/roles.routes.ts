import { Router } from 'express';
import { RolesController } from '../controllers/roles.controller';

const router = Router();
const controller = new RolesController();

router.get('/', controller.getAll);

export default router;