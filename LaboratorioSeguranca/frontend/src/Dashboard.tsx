import React, { useEffect, useState } from 'react';

interface Comentario {
  id: number;
  texto: string;
  usuario_id: number;
}

export const Dashboard: React.FC = () => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/comentarios')
      .then((res) => res.json())
      .then((data) => setComentarios(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mural de Comentários</h2>
      <div className="comentarios-lista">
        {comentarios.map((comentario) => (
          <div key={comentario.id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
            {/* 
              PREVENÇÃO DE XSS:
              O React por padrão escapa o texto dentro de tags HTML como <p>{...}</p>.
              NUNCA utilize `dangerouslySetInnerHTML={{ __html: comentario.texto }}`.
            */}
            <p>{comentario.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;