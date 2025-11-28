import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

// Importar rotas
import authRotas from './routes/authRotas.js';
import produtoRotas from './routes/produtoRotas.js';
import usuarioRotas from './routes/usuarioRotas.js';
import carrinhoRotas from './routes/carrinhoRotas.js';
import finalizacaoRotas from './routes/finalizacaoRotas.js';

// Importar middlewares
import { logMiddleware } from './middlewares/logMiddleware.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de Segurança
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
                "https://cdnjs.cloudflare.com",
                "https://ka-f.fontawesome.com"
            ],
            "connect-src": [
                "'self'",
                "https://cdn.jsdelivr.net",
                "https://stackpath.bootstrapcdn.com",
                "https://ka-f.fontawesome.com"
            ],
            "img-src": [
                "'self'",
                "data:",
                "https://cdn.jsdelivr.net",
                "https://stackpath.bootstrapcdn.com",
                "https://ka-f.fontawesome.com"
            ]
        }
    }
}));

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Middleware de Log
app.use(logMiddleware);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'views')));
app.use('/public', express.static(path.join(__dirname, "public")));

// Middleware de debug para cookies e headers
app.use((req, res, next) => {
    console.log('📦 Cookies recebidos:', req.cookies);
    console.log('🌐 Origin da requisição:', req.headers.origin);
    console.log('🔗 Headers da requisição:', req.headers); // ← CORRIGIDO: console.log
    next();
});


// Rotas da API
app.use('/auth', authRotas);
app.use('/usuarios', usuarioRotas);
app.use('/carrinho', carrinhoRotas);
app.use('/finalizacao', finalizacaoRotas);
app.use('/api/produtos', produtoRotas);

// Rotas de Páginas - Organizadas e sem conflitos
const pages = {
    '/login': 'login.html',
    '/cadastro': 'cadastro.html',
    '/sobrenos': 'sobrenos.html',
    '/dados': 'dados.html',
    '/entrega': 'entrega.html',
    '/finalizar': 'finalizado.html',
    '/': 'index.html' // Adicione uma página inicial se necessário
};

// Registrar rotas de páginas dinamicamente
Object.entries(pages).forEach(([route, file]) => {
    app.get(route, (req, res) => {
        res.sendFile(path.join(__dirname, 'views', file));
    });
});

// Rotas de Produtos - Estrutura Consistente
app.get('/produtos/:categoria', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'produtos.html'));
});

app.get('/produtos/:categoria/:id', (req, res) => {
    // Você pode escolher um template único ou baseado na categoria
    const categoria = req.params.categoria;
    
    // Exemplo: se quiser templates diferentes por categoria
    const templateMap = {
        'pesepernas': 'infoprodpes.html',
        // adicione outros mapeamentos se necessário
    };
    
    const template = templateMap[categoria] || 'infoproduto.html';
    res.sendFile(path.join(__dirname, 'views', template));
});

// Rota raiz da API
app.get('/api', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'API projeto Safework',
        versao: '1.0.0',
        rotas: {
            autenticacao: '/auth',
            usuarios: '/usuarios',
            produtos: '/api/produtos',
            carrinho: '/carrinho',
            finalizacao: '/finalizacao'
        }
    });
});

// Middleware para tratar rotas não encontradas
// app.use('*', (req, res) => {
//     res.status(404).json({
//         sucesso: false,
//         erro: 'Rota não encontrada',
//         mensagem: `A rota ${req.method} ${req.originalUrl} não foi encontrada`
//     });
// });

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📋 API projeto Safework - Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

export default app;