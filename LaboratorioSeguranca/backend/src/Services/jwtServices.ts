import jwt from 'jsonwebtoken';
import { RetornoPayload } from '../Tipos/retornoPayload'; // Ajuste o caminho se necessário

const SECRET_KEY = process.env.JWT_SECRET || 'chave_super_secreta_aqui_mude_em_producao';

export const jwtService = {
  gerarToken: (payload: object): string => {
    // Define um tempo de expiração para o token
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  },

  validarToken: (token: string): RetornoPayload | null => {
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as RetornoPayload;
      return decoded;
    } catch (error) {
      // Se o token for inválido, expirado ou adulterado, retorna null
      return null;
    }
  }
};