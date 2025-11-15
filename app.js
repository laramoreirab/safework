import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


import authRotas from './routes/authRotas.js' //importando arquivo no qual estará 

//Importando middlewares
import { logMiddleware } from './middlewares/logMiddleware.js'

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filname);

const PORT = process.env.PORT || 3000;

app.use(helmet()); //helmet é um middleware para segurança HTTP

app.use(cors({
    origin: '*', // Permitir todas as origens. Ajuste conforme necessário. Ex.: 'http://meufrontend.com'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    preflightContinue: false, // Não passar para o próximo middleware
    optionsSuccessStatus: 200 // Responder com 200 para requisições OPTIONS
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(logMiddleware);

// Rotas da API 
app.use ('/api/auth', authRotas)

app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'API projeto Safework',
        versao: '1.0.0',
        rotas:{
            autenticacao: '/api/auth'
        },
        documentacao: {
            login: 'POST /api/auth/login'
        }
    })
});

// Middleware para tratar rotas não encontradas
app.use('*', (req,res)=>{
    res.status(404).json({
        sucesso: false,
        erro: 'Rota não encontrada',
        mensagem: `A rota ${req.method} ${req.originalUrl} não foi encontrada`
    });
});

//iniciando o Servidor
app.listen(PORT, () =>{
    console.log(`Servidor rodando em http://localhost:${PORT}`)
    console.log(`API projeto Safework`)
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
})

export default app;