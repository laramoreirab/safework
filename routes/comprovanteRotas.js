import express from 'express'
import { baixarComprovante } from '../controllers/comprovanteController.js'

const router = express.Router()

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

router.get('/:')