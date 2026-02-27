import express from 'express'
import comprovanteController from '../controllers/comprovanteController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router()

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

router.get('/:id', comprovanteController.baixarComprovante)

export default router