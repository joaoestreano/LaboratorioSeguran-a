import { Request, Response } from 'express';
import pool from '../database';
import { gerarToken } from '../Services/jwtServices';

export const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    const query = 'SELECT id, nome, email, role FROM usuarios WHERE email = $1 AND senha = $2';
    const result = await pool.query(query, [email, senha]);

    if (result.rows.length === 0) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas.' });
    }

    const usuario = result.rows[0];
    const token = gerarToken({ id: usuario.id, email: usuario.email, role: usuario.role });

    // Envia o token como um cookie seguro
    res.cookie('token', token, {
      httpOnly: true, // Impede que JavaScript no frontend (XSS) acesse o token
      secure: process.env.NODE_ENV === 'production', // Apenas HTTPS em produção
      sameSite: 'strict', // Protege contra ataques CSRF
      maxAge: 3600000 // 1 hora de validade
    });

    return res.json({
      mensagem: 'Login realizado com sucesso',
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno no servidor.' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  return res.json({ mensagem: 'Logout realizado com sucesso' });
};

export const obterPerfil = async (req: Request, res: Response) => {
  const usuarioLogado = (req as any).usuario;

  try {
    const query = 'SELECT id, nome, email, role FROM usuarios WHERE id = $1';
    const result = await pool.query(query, [usuarioLogado.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao buscar perfil.' });
  }
};