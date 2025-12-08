//apenas o adm tem acesso, é a parte do painel do adm que ele pode fazer crud dos usuários
import express from 'express';
import authController from '../controllers/authController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js'
import UserController from '../controllers/userController.js';

const router = express.Router()

router.get('/', authMiddleware, adminMiddleware, authController.listarUsuarios);
router.post('/', authMiddleware, adminMiddleware, authController.criarUsuario);
router.put('/:id', authMiddleware, adminMiddleware, authController.atualizarUsuario);
router.delete('/:id', authMiddleware, adminMiddleware, authController.excluirUsuario);


// GET /usuarios/perfil - Obter dados do perfil
router.get('/perfil', authMiddleware, UserController.obterPerfil);

// PUT /usuarios/atualizar-nome - Atualizar nome
router.put('/atualizar-nome', authMiddleware, UserController.atualizarNome);

// PUT /usuarios/atualizar-email - Atualizar email
router.put('/atualizar-email', authMiddleware, UserController.atualizarEmail);

// PUT /usuarios/atualizar-telefone - Atualizar telefone
router.put('/atualizar-telefone', authMiddleware, UserController.atualizarTelefone);

// PUT /usuarios/atualizar-cnpj - Atualizar CNPJ
router.put('/atualizar-cnpj', authMiddleware, UserController.atualizarCNPJ);

// POST /usuarios/logout - Fazer logout
router.post('/logout', authMiddleware, UserController.logout);

// Rotas OPTIONS para CORS (preflight requests)
router.options('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
     // Permite envio de cookies
     res.header('Access-Control-Allow-Credentials', 'true'); 
    res.sendStatus(200);
});

router.options('/:id', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
     // Permite envio de cookies
     res.header('Access-Control-Allow-Credentials', 'true'); 
    res.sendStatus(200);
});

export default router;
