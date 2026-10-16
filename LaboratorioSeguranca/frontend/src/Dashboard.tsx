import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Comentario {
  id: number;
  texto: string;
  autor: string;
}

export const Dashboard: React.FC = () => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const carregarComentarios = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/comentarios', {
        credentials: 'include' // Essencial para envio do cookie, caso a API esteja em outra origem
      });
      const data = await response.json();
      setComentarios(data);
    } catch (err) {
      console.error('Erro ao carregar comentários:', err);
    }
  };

  useEffect(() => {
    carregarComentarios();
  }, []);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/comentarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Envia automaticamente o cookie HttpOnly
        body: JSON.stringify({ texto: novoComentario })
      });

      if (response.ok) {
        setNovoComentario('');
        carregarComentarios();
        setErro('');
      } else {
        const errData = await response.json();
        if (response.status === 401 || response.status === 403) {
           setErro('Sua sessão expirou. Faça login novamente.');
        } else {
           setErro(errData.mensagem || 'Erro ao enviar comentário.');
        }
      }
    } catch (err) {
      setErro('Erro de conexão com o servidor.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/api/usuarios/logout', { 
        method: 'POST',
        credentials: 'include' 
      });
      navigate('/login');
    } catch (err) {
      console.error('Erro ao deslogar');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Painel de Comentários</h2>
        <button onClick={handleLogout}>Sair</button>
      </div>

      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <form onSubmit={handleEnviar}>
        <textarea
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          placeholder="Escreva seu comentário..."
          rows={4}
          cols={50}
        />
        <br />
        <button type="submit">Enviar Comentário</button>
      </form>

      <h3>Comentários Recentes</h3>
      <ul>
        {comentarios.map((c) => (
          <li key={c.id}>
            <strong>{c.autor}:</strong> {c.texto}
          </li>
        ))}
      </ul>
    </div>
  );
};