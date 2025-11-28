import express from 'express';
import finalizacaoController from '../controllers/finalizacaoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

// GET /finalizacao/dados - Obter dados iniciais
router.get('/dados', finalizacaoController.obterDadosIniciais);

// POST /finalizacao/dados - Salvar dados empresariais
router.post('/dados', finalizacaoController.salvarDadosEmpresariais);

// POST /finalizacao/entrega - Salvar dados de entrega
router.post('/entrega', finalizacaoController.salvarDadosEntrega);

// POST /finalizacao/pagamento - Processar pagamento
router.post('/pagamento', finalizacaoController.processarPagamento);

// POST /finalizacao/finalizar - Finalizar pedido
router.post('/finalizar', finalizacaoController.finalizarPedido);

// GET /finalizacao/resumo/:id - Obter resumo do pedido
router.get('/resumo/:id', finalizacaoController.obterResumoPedido);

export default router;