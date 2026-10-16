import { Router } from 'express';
import { listarComentarios, criarComentario } from '../controllers/comentarioController';
import { autenticarJWT } from '../Services/jwtServices';

const router = Router();

router.get('/', listarComentarios);
router.post('/', autenticarJWT, criarComentario); // Exige autenticação válida para comentar

export default router;