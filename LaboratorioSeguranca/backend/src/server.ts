import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes';
import comentarioRoutes from './routes/comentarioRoutes';
import hackerMalvadaoRoutes from './routes/hackerMalvadaoRoutes';

const app = express();

app.use(express.json());
app.use(cookieParser());

// Configuração do CORS para permitir o envio e recebimento de cookies
app.use(cors({
    origin: 'http://localhost:5173', // URL do seu frontend Vite
    credentials: true
}));

app.use('/usuarios', usuarioRoutes);
app.use('/comentarios', comentarioRoutes);
app.use('/hacker', hackerMalvadaoRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});