import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../Services/jwtServices';

export const verificarAutenticacao = (req: Request, res: Response, next: NextFunction) => {
  // CORREÇÃO: Lê o token diretamente dos cookies usando o cookie-parser
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  const payload = jwtService.validarToken(token);

  if (!payload) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }

  req.usuario = payload;
  next();
};