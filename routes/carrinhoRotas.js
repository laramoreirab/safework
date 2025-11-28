// carrinhoRotas.js
import express from 'express';
import carrinhoController from '../controllers/carrinhoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas protegidas por autenticação
router.get('/', authMiddleware, carrinhoController.obterCarrinho);
router.post('/adicionar', authMiddleware, carrinhoController.adicionarItem);
router.put('/item/:id', authMiddleware, carrinhoController.atualizarQuantidadeItem);
router.delete('/item/:id', authMiddleware, carrinhoController.removerItem);

export default router;