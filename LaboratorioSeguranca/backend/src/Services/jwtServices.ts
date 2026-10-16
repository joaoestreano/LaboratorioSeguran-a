import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { RetornoPayload } from '../Tipos/retornoPayload';

const SECRET_KEY = process.env.JWT_SECRET || 'chave_secreta_padrao_segura';

export const gerarToken = (payload: RetornoPayload): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

export const verificarToken = (token: string): RetornoPayload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as RetornoPayload;
  } catch (error) {
    return null;
  }
};

// Middleware para proteção de rotas buscando o JWT no cookie
export const autenticarJWT = (req: Request, res: Response, next: NextFunction) => {
  // Lê o token diretamente do cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso não autorizado: Token não fornecido.' });
  }

  const payload = verificarToken(token);

  if (!payload) {
    return res.status(403).json({ mensagem: 'Acesso negado: Token inválido ou expirado.' });
  }

  // Anexa o usuário autenticado ao objeto da requisição
  (req as any).usuario = payload;
  next();
};