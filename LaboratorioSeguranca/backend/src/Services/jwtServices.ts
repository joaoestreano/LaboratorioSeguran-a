import jwt from 'jsonwebtoken';
import { RetornoPayload } from '../Tipos/retornoPayload';

// Em produção, SEMPRE use variáveis de ambiente (.env) para a chave secreta
const SECRET_KEY = process.env.JWT_SECRET || 'chave_super_secreta_aqui_mude_em_producao';

export const jwtService = {
  gerarToken: (payload: object): string => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  },

  // IMPLEMENTAÇÃO DA VALIDAÇÃO
  validarToken: (token: string): RetornoPayload | null => {
    try {
      // O método jwt.verify checa a assinatura digital e a expiração do token.
      // Se o token foi alterado por um hacker, ou se o tempo expirou, ele lança um erro.
      const decoded = jwt.verify(token, SECRET_KEY) as RetornoPayload;
      
      return decoded; // Token válido! Retorna os dados do usuário (payload).
    } catch (error) {
      // Tratamento de erros específicos para logs de segurança
      if (error instanceof jwt.TokenExpiredError) {
        console.error('Falha de segurança: Tentativa de uso de token expirado.');
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.error('Falha de segurança: Token inválido, malformado ou adulterado.');
      }
      
      // Retorna nulo para indicar que a validação falhou
      return null;
    }
  }
};