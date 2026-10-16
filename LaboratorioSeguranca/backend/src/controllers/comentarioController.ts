import { Response } from 'express';
import { pool } from '../database';
import { CustomRequest } from '../middlewares/authMiddleware';

export const listarComentarios = async (req: CustomRequest, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM comentarios ORDER BY id DESC');
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao buscar comentários.' });
  }
};

export const criarComentario = async (req: CustomRequest, res: Response) => {
  const { texto } = req.body;
  const usuarioId = req.usuario?.id; // Obtido com segurança através do JWT

  if (!texto) {
    return res.status(400).json({ erro: 'O texto do comentário é obrigatório.' });
  }

  try {
    // PREVENÇÃO DE SQL INJECTION: Consulta parametrizada
    const query = 'INSERT INTO comentarios (texto, usuario_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [texto, usuarioId]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao criar comentário.' });
  }
};