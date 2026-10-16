import { Request, Response } from 'express';
import pool from '../database';

// Função auxiliar simples para sanitizar HTML/XSS no backend
const sanitizarTexto = (texto: string): string => {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export const listarComentarios = async (req: Request, res: Response) => {
  try {
    const query = 'SELECT c.id, c.texto, u.nome AS autor FROM comentarios c JOIN usuarios u ON c.usuario_id = u.id ORDER BY c.id DESC';
    const result = await pool.query(query);
    return res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao buscar comentários.' });
  }
};

export const criarComentario = async (req: Request, res: Response) => {
  const { texto } = req.body;
  const usuarioLogado = (req as any).usuario; // Obtido via Middleware JWT

  if (!texto || texto.trim() === '') {
    return res.status(400).json({ mensagem: 'O texto do comentário não pode estar vazio.' });
  }

  // Prevenção contra Stored XSS
  const textoSanitizado = sanitizarTexto(texto);

  try {
    // Prevenção contra SQL Injection usando consulta parametrizada
    const query = 'INSERT INTO comentarios (texto, usuario_id) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [textoSanitizado, usuarioLogado.id]);

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao salvar comentário.' });
  }
};