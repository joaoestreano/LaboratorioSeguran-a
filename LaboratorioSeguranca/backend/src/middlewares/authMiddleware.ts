import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../Services/jwtServices';

export const verificarAutenticacao = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = jwtService.validarToken(token);

  if (!payload) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }

  // Injeta os dados do usuário na requisição para uso nos controllers
  req.usuario = payload;
  next();
};