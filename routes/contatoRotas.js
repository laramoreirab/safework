import express from 'express'
import contatoController from '../controllers/contatoController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

// GET /api/contato - listar Contato 
router.get('/',  authMiddleware, adminMiddleware, contatoController.listar) // só para admin

// POST /api/contato - Enviar Contato
router.post('/', contatoController.criar) // para todo tipo de usuario

// DELETE /api/contato - Apagar mensagem
router.delete('/:id', authMiddleware, adminMiddleware, contatoController.excluir) // só para admin

export default router