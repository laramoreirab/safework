import express from 'express';
import PedidosController from '../controllers/pedidosController.js';
import { adminMiddleware, authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

// GET /pedidos/historico - Obter histórico de pedidos
router.get('/historico', PedidosController.obterHistorico);

// GET //pedidos/admin/todas - Obter TODO o histórico de pedidos
router.get('/admin/todas', adminMiddleware, PedidosController.obterTodasVendas);

// GET /pedidos/dados-perfil - Obter dados do perfil
router.get('/dados-perfil', PedidosController.obterDadosPerfil);

export default router;