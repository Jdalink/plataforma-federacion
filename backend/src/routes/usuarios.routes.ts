import { Router } from 'express';
import { UsuariosController } from '../controllers/usuarios.controller';

const router = Router();
const controller = new UsuariosController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;