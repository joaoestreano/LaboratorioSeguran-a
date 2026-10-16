import { Router } from 'express';
import { listarComentarios, criarComentario } from '../controllers/comentarioController';
import { autenticarJWT } from '../Services/jwtServices';

const router = Router();

// Qualquer um pode listar os comentários
router.get('/', listarComentarios);

// MAS apenas usuários com token válido (autenticados) podem criar comentários
// O middleware "autenticarJWT" é chamado ANTES do "criarComentario"
router.post('/', autenticarJWT, criarComentario);

export default router;