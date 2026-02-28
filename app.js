import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { authMiddleware, adminMiddleware } from './middlewares/authMiddleware.js';
import { fileURLToPath } from 'url';


// Importar rotas
import authRotas from './routes/authRotas.js';
import produtoRotas from './routes/produtoRotas.js';
import usuarioRotas from './routes/usuarioRotas.js';
import carrinhoRotas from './routes/carrinhoRotas.js';
import finalizacaoRotas from './routes/finalizacaoRotas.js';
import pedidosRotas from './routes/pedidosRotas.js';
import contatoRotas from './routes/contatoRotas.js'
import comprovanteRotas from './routes/comprovanteRotas.js'

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'views')));
app.use('/public', express.static(path.join(__dirname, "public")));

app.get('/login', (req,res) =>{
    res.sendFile(path.join(__dirname, 'views', 'login.html'))
})
app.get('/cadastro', (req,res) =>{
    res.sendFile(path.join(__dirname, 'views', 'cadastro.html'))
})
app.get('/contato', (req,res) =>{
    res.sendFile(path.join(__dirname, 'views', 'contato.html'))
})
app.get('/sobrenos', (req,res) =>{
    res.sendFile(path.join(__dirname, 'views', 'sobrenos.html'))
})
app.get('/dados', (req,res) =>{
    res.sendFile(path.join(__dirname, 'views', 'dados.html'))
})
app.get('/pagamento', (req,res) =>{
    res.sendFile(path.join(__dirname, 'views', 'pagamento.html'))
})
app.get('/entrega', (req,res) =>{
    res.sendFile(path.join(__dirname, 'views', 'entrega.html'))
})
app.get('/finalizar', (req,res) =>{
    res.sendFile(path.join(__dirname, 'views', 'finalizado.html'))
})
app.get('/adm', authMiddleware, adminMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'painel-adm.html'));
});
app.get('/config-compras', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'config-compras.html'));
});

app.get('/config-home', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'config-home.html'));
});

// Middleware de debug para cookies e headers
app.use((req, res, next) => {
    console.log('📦 Cookies recebidos:', req.cookies);
    console.log('🌐 Origin da requisição:', req.headers.origin);
    console.log('🔗 Headers da requisição:', req.headers); 
    next();
});


// Rotas da API
app.use('/auth', authRotas);
app.use('/usuarios', usuarioRotas);
app.use('/carrinho', carrinhoRotas);
app.use('/finalizacao', finalizacaoRotas);
app.use('/api/produtos', produtoRotas);
app.use('/pedidos', pedidosRotas);
app.use('/api/contato', contatoRotas)
app.use('/comprovante',comprovanteRotas )

// Rotas de Páginas - Organizadas e sem conflitos
const pages = {
    '/login': 'login.html',
    '/cadastro': 'cadastro.html',
    '/sobrenos': 'sobrenos.html',
    '/dados': 'dados.html',
    '/entrega': 'entrega.html',
    '/pagamento': 'pagamento.html',
    '/finalizar': 'finalizado.html',
    '/': 'index.html'
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

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📋 API projeto Safework - Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

export default app;