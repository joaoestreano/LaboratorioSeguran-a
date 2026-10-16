import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../Services/jwtServices';

export const autenticarMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token; // Obtém o token a partir do cookie

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const payload = verificarToken(token);
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(403).json({ mensagem: 'Token inválido ou expirado.' });
  }
};