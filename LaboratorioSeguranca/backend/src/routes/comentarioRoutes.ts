import { Router } from 'express';
import { listarComentarios, criarComentario } from '../controllers/comentarioController';
import { autenticarToken } from '../middlewares/authMiddleware';

const router = Router();

// Qualquer usuário pode ver os comentários
router.get('/comentarios', listarComentarios);

// Apenas usuários autenticados via JWT podem criar comentários
router.post('/comentarios', autenticarToken, criarComentario);

export default router;