import express from 'express';
import AvaliacaoController from '../controllers/avaliacaoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:produtoId', AvaliacaoController.listar);                          // público
router.post('/:produtoId', authMiddleware, AvaliacaoController.criar);          // precisa de login

export default router;