import { Request, Response } from 'express';
import { pool } from '../database';
import { gerarToken } from '../Services/jwtServices';

export const login = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    // PREVENÇÃO DE SQL INJECTION: Consulta parametrizada ($1, $2)
    const query = 'SELECT * FROM usuarios WHERE email = $1 AND senha = $2';
    const result = await pool.query(query, [email, senha]);

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha incorretos.' });
    }

    const usuario = result.rows[0];

    // Gerando o token JWT
    const token = gerarToken({
      id: usuario.id,
      email: usuario.email,
      cargo: usuario.cargo || 'user'
    });

    return res.json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
};

export const listarUsuarios = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, nome, email, cargo FROM usuarios');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar usuários.' });
  }
};