//apenas o adm tem acesso, é a parte do painel do adm que ele pode fazer crud dos usuários
import express from 'express';
import authController from '../controllers/authController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', authController.listarUsuarios);
router.post('/', authController.criarUsuario);
router.put('/:id', authController.atualizarUsuario);
router.delete('/:id', authController.excluirUsuario);

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
