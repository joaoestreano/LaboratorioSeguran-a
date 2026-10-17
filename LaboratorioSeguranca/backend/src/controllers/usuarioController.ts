import { Request, Response } from 'express';
import pool from '../database';
import { jwtService } from '../Services/jwtServices';

export const loginUsuario = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const query = 'SELECT id, nome, email FROM usuarios WHERE email = $1 AND senha = $2';
    const result = await pool.query(query, [email, senha]);

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const usuario = result.rows[0];

    // Gera o token
    const token = jwtService.gerarToken({ id: usuario.id, nome: usuario.nome });

    // CORREÇÃO: Envia o token via Cookie HttpOnly
    res.cookie('token', token, {
      httpOnly: true, // Protege contra XSS (JavaScript no front não lê)
      secure: process.env.NODE_ENV === 'production', // Use true se estiver usando HTTPS em produção
      sameSite: 'strict', // Protege contra CSRF
      maxAge: 3600000 // Tempo de vida do cookie: 1 hora (em milissegundos)
    });

    // Não retornamos mais o token no corpo da resposta
    return res.json({ mensagem: 'Login bem sucedido', usuario: { id: usuario.id, nome: usuario.nome } });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

export const logoutUsuario = (req: Request, res: Response) => {
  // Para fazer logout, basta limpar o cookie
  res.clearCookie('token');
  return res.json({ mensagem: 'Logout realizado com sucesso' });
};