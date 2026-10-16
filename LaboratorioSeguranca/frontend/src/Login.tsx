import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Necessário para receber o cookie
        body: JSON.stringify({ email, senha })
      });

      if (response.ok) {
        // O token agora é armazenado via Cookie pelo navegador, não usamos mais localStorage.
        navigate('/dashboard');
      } else {
        const errData = await response.json();
        setErro(errData.mensagem || 'Erro ao realizar login.');
      }
    } catch (err) {
      setErro('Erro de conexão com o servidor.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email: </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Senha: </label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        </div>
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};