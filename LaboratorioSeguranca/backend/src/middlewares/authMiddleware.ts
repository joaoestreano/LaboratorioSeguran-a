import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../Services/jwtServices';
import { RetornoPayload } from '../Tipos/retornoPayload';

export interface CustomRequest extends Request {
  usuario?: RetornoPayload;
}

// Garante que a requisição possui um Token JWT válido
export const autenticarToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer <TOKEN>

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const payload = verificarToken(token);
    req.usuario = payload;
    next();
  } catch (err) {
    return res.status(403).json({ erro: 'Token inválido ou expirado.' });
  }
};

// Evita Broken Access Control verificando se o usuário possui a permissão necessária
export const autorizarCargo = (cargosPermitidos: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.usuario || !cargosPermitidos.includes(req.usuario.cargo)) {
      return res.status(403).json({ erro: 'Acesso negado: permissão insuficiente.' });
    }
    next();
  };
};