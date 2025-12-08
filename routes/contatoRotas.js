import express from 'express'
import contatoController from '../controllers/contatoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

// GET /contato - listar Contato 
router.get('/',  authMiddleware, adminMiddleware, contatoController.listar) // só para admin

// POST /contato - Enviar Contato
router.post('/', contatoController.criar)

export default router