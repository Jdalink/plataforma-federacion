import { Router } from 'express';
import { AtletasController } from '../controllers/atletas.controller';

const router = Router();
const atletasController = new AtletasController();

router.get('/', atletasController.getAll);
router.post('/', atletasController.create);
router.get('/:id', atletasController.getById);
router.put('/:id', atletasController.update);
router.delete('/:id', atletasController.delete);

export default router;