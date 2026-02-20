import express from 'express'
import authController from '../controllers/authController.js'
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import UserController from '../controllers/userController.js';
import cookieParser from 'cookie-parser';
import path from 'path'


const router = express.Router()


router.post('/login', authController.login);
router.post('/registrar', authController.registrar);

// Rotas protegidas (precisam de autenticação)
router.get('/perfil', authMiddleware, authController.obterPerfil); //pagina de perfil */


// PUT /usuarios/atualizar-nome - Atualizar nome
router.put('/atualizar-nome', authMiddleware, UserController.atualizarNome);

// PUT /usuarios/atualizar-email - Atualizar email
router.put('/atualizar-email', authMiddleware, UserController.atualizarEmail);

// PUT /usuarios/atualizar-telefone - Atualizar telefone
router.put('/atualizar-telefone', authMiddleware, UserController.atualizarTelefone);

// PUT /usuarios/atualizar-cnpj - Atualizar CNPJ
router.put('/atualizar-cnpj', authMiddleware, UserController.atualizarCNPJ);



export default router;