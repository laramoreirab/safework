import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { read } from './config/database.js';


// import produtoTotas from './routes/produtoRotas.js' // rota que faz toda a manipulação de produtos 
import authRotas from './routes/authRotas.js' //rota que manipula cadastro,login
import produtoRotas from './routes/produtoRotas.js' // rota que manipula produtos
// import usuarioRotas from './routes/usuarioRotas.js' //rota que faz a manipulação de usuário, excluir, buscar etc


//Importando middlewares
// import { logMiddleware } from './middlewares/logMiddleware.js'

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

app.use(helmet()); //helmet é um middleware para segurança HTTP

app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            "default-src": ["'self'"],
            "script-src": [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://stackpath.bootstrapcdn.com",
                "https://kit.fontawesome.com",
                "https://cdnjs.cloudflare.com"
            ],
            "style-src": [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://stackpath.bootstrapcdn.com",
                "'unsafe-inline'",
                "https://cdn.jsdelivr.net",
                "https://stackpath.bootstrapcdn.com",
                "https://cdnjs.cloudflare.com",
                "https://fonts.googleapis.com",
                "'unsafe-inline'"
            ],
            "font-src": [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://stackpath.bootstrapcdn.com",
                "https://fonts.googleapis.com",
                "https://fonts.gstatic.com",
                "https://fonts.gstatic.com",
                "https://cdnjs.cloudflare.com"
            ],
            "connect-src": [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://stackpath.bootstrapcdn.com"
            ],
            "img-src": [
                "'self'",
                "data:",
                "https://cdn.jsdelivr.net",
                "https://stackpath.bootstrapcdn.com"
            ]
        }
    }
}));

app.use(cors({
    origin: '*', // Permitir todas as origens. Ajuste conforme necessário. Ex.: 'http://meufrontend.com'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
    preflightContinue: false, // Não passar para o próximo middleware
    optionsSuccessStatus: 200 // Responder com 200 para requisições OPTIONS
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(logMiddleware);

// Middleware para interpretar cookies
app.use(cookieParser());

// Rotas da API 
app.use('/auth', authRotas)
app.use('/api/produtos', produtoRotas)

// servir arquivos estáticos da pasta 'views'
app.use(express.static(path.join(__dirname, 'views')));
// Expõe a pasta "public" como estática
app.use('/public', express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'API projeto Safework',
        versao: '1.0.0',
        rotas: {
            autenticacao: '/auth'
        },
        documentacao: {
            login: 'POST /auth/login'
        }
    });
});

app.get('/produtos/:descricao', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/produtos.html'))
})

app.get('/produtos/pesepernas/:id', (req,res) => {
    res.sendFile(path.join(__dirname, '/views/infoprodpes.html'))
})
app.get('/produtos/:descricao/:id', (req,res) => {
    res.sendFile(path.join(__dirname, '/views/infoproduto.html'))
})


// Middleware para tratar rotas não encontradas
// app.use('*', (req, res) => {
//     res.status(404).json({
//         sucesso: false,
//         erro: 'Rota não encontrada',
//         mensagem: `A rota ${req.method} ${req.originalUrl} não foi encontrada`
//     });
// });

//iniciando o Servidor

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
    console.log(`API projeto Safework`)
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
})

export default app;