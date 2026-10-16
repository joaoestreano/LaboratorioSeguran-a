import jwt from 'jsonwebtoken';
import { RetornoPayload } from '../Tipos/retornoPayload';

const JWT_SECRET = process.env.JWT_SECRET || 'chave_secreta_laboratorio_seguranca';

export const gerarToken = (payload: RetornoPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
};

export const verificarToken = (token: string): RetornoPayload => {
  return jwt.verify(token, JWT_SECRET) as RetornoPayload;
};