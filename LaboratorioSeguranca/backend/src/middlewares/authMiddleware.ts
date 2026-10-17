import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../Services/jwtServices';

// Extensão da tipagem do Express para incluir o usuário validado na requisição
declare global {
  namespace Express {
    interface Request {
      usuario?: any;
    }
  }
}

export const validarJWT = (req: Request, res: Response, next: NextFunction) => {
  // 1. Tenta capturar o token dos cookies (proteção contra XSS já aplicada)
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ 
      erro: 'Acesso negado. Nenhum token de autenticação foi encontrado.' 
    });
  }

  // 2. Chama o serviço para validar o token
  const payload = jwtService.validarToken(token);

  // 3. Se a validação falhou (retornou null), bloqueia a requisição
  if (!payload) {
    // É importante limpar o cookie se o token for inválido/expirado
    res.clearCookie('token'); 
    return res.status(401).json({ 
      erro: 'Sessão expirada ou token inválido. Faça login novamente.' 
    });
  }

  // 4. Token validado com sucesso! 
  // Anexamos os dados do usuário (ex: id, nivel_acesso) na requisição.
  // Isso é essencial para evitar o "Broken Access Control" nos controllers.
  req.usuario = payload;
  
  // 5. Permite que a requisição continue para o Controller
  next();
};