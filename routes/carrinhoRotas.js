import express from 'express';
import carrinhoController from '../controllers/carrinhoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /carrinho - Obter carrinho
router.get('/',authMiddleware, carrinhoController.obterCarrinho);
// POST /carrinho/adicionar - Adicionar item
router.post('/adicionar',authMiddleware, carrinhoController.adicionarItem);
// PUT /carrinho/item/:id - Atualizar quantidade
router.put('/item/:id',authMiddleware, carrinhoController.atualizarItem);
// DELETE /carrinho/item/:id - Remover item
router.delete('/item/:id',authMiddleware, carrinhoController.removerItem);
// DELETE /carrinho/limpar - Limpar carrinho
router.delete('/limpar',authMiddleware, carrinhoController.limparCarrinho);

export default router;