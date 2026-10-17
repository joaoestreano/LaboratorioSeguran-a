import { Request, Response } from 'express';
import pool from '../database'; // Assumindo que você usa pg (PostgreSQL)
import { jwtService } from '../Services/jwtServices';

export const loginUsuario = async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  try {
    // CORREÇÃO DE SQL INJECTION: Uso de parâmetros $1 e $2
    const query = 'SELECT id, nome, email FROM usuarios WHERE email = $1 AND senha = $2';
    const values = [email, senha]; // NUNCA concatene variáveis diretamente na query!

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const usuario = result.rows[0];

    // Gera o token com os dados básicos do usuário
    const token = jwtService.gerarToken({ id: usuario.id, nome: usuario.nome });

    return res.json({ mensagem: 'Login bem sucedido', token });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};