import express from "express";
import userRoutes from "./routes/usuarioRoutes";
import commentRoutes from "./routes/comentarioRoutes";
import hackerMalvadao from "./routes/hackerMalvadaoRoutes";

const app = express();


app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use("/usuario", userRoutes);
app.use("/comentario", commentRoutes);
app.use("/hacker-malvadao", hackerMalvadao);

app.listen(3001, () => {
    console.log("Servidor Vulnerável rodando na porta 3001");
});import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// importe suas rotas aqui...

const app = express();

// CORREÇÃO: Configuração do CORS para permitir Cookies
app.use(cors({
  origin: 'http://localhost:5173', // Coloque AQUI a URL exata do seu frontend (ex: Vite usa 5173)
  credentials: true, // OBRIGATÓRIO: Permite o envio e recebimento de cookies
}));

app.use(express.json());
app.use(cookieParser()); // OBRIGATÓRIO: Permite ler req.cookies

// Registre suas rotas aqui...
// app.use('/api/usuarios', usuarioRoutes);
// app.use('/api/comentarios', comentarioRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});