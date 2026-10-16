import { Router } from 'express';
import { login, logout, obterPerfil } from '../controllers/usuarioController';
import { autenticarJWT } from '../Services/jwtServices';

const router = Router();

router.post('/login', login);
router.post('/logout', logout); // Rota para limpar o cookie de sessão
router.get('/perfil', autenticarJWT, obterPerfil);

export default router;