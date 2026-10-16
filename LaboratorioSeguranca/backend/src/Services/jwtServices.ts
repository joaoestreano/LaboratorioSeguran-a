import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { RetornoPayload } from '../Tipos/retornoPayload';

const SECRET_KEY = process.env.JWT_SECRET || 'chave_secreta_padrao_segura';

// Função para gerar o token
export const gerarToken = (payload: RetornoPayload): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
};

// Função para verificar se o token é válido e retornar o payload
export const verificarToken = (token: string): RetornoPayload | null => {
  try {
    return jwt.verify(token, SECRET_KEY) as RetornoPayload;
  } catch (error) {
    return null;
  }
};

// Middleware para validar o JWT nas requisições
export const autenticarJWT = (req: Request, res: Response, next: NextFunction) => {
  // Como configuramos para usar cookies no passo anterior, pegamos daqui:
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ mensagem: 'Acesso não autorizado: Token não fornecido.' });
  }

  // Verifica a validade do token
  const payload = verificarToken(token);

  if (!payload) {
    return res.status(403).json({ mensagem: 'Acesso negado: Token inválido ou expirado.' });
  }

  // Se o token for válido, armazenamos as informações do usuário na requisição
  // para que as rotas subsequentes possam usar (ex: saber quem fez o comentário)
  (req as any).usuario = payload;
  
  // Permite que a requisição continue para a rota desejada
  next();
};