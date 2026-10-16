import { Router } from 'express';
import { login, logout, obterPerfil } from '../controllers/usuarioController';
import { autenticarJWT } from '../Services/jwtServices';

const router = Router();

// Rotas públicas
router.post('/login', login);
router.post('/logout', logout);

// Rota protegida: O usuário precisa de um JWT válido para ver seu próprio perfil
router.get('/perfil', autenticarJWT, obterPerfil);

export default router;