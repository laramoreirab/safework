import express from 'express'
import authController from '../controllers/authController.js'
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import path from 'path'


const router = express.Router()


router.post('/login', authController.login);
router.post('/registrar', authController.registrar);


// Rotas protegidas (precisam de autenticação)
router.get('/perfil', authMiddleware, authController.obterPerfil); //pagina d eperfil

// Rotas OPTIONS apar CORS (preflight requests)
router.options('/login', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // Permite envio de cookies
    res.header('Access-Control-Allow-Credentials', 'true'); 
    res.sendStatus(200);
});

router.options('/registrar', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // Permite envio de cookies
    res.header('Access-Control-Allow-Credentials', 'true'); 
    res.sendStatus(200);
});

router.options('/perfil', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // Permite envio de cookies
    res.header('Access-Control-Allow-Credentials', 'true'); 
    res.sendStatus(200);
});

export default router;