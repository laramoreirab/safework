import express from 'express'
import authController from '../controllers/authController.js'
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';
import cookieParser from 'cookie-parser';
import path from 'path'


const router = express.Router()


router.post('/login', authController.login);
router.post('/registrar', authController.registrar);


// Rotas protegidas (precisam de autenticação)
router.get('/perfil', authMiddleware, authController.obterPerfil); //pagina d eperfil

export default router;