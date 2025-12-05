import express from 'express';
import PedidosController from '../controllers/pedidosController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todas as rotas precisam de autenticação
router.use(authMiddleware);

// GET /pedidos/historico - Obter histórico de pedidos
router.get('/historico', PedidosController.obterHistorico);

// GET /pedidos/dados-perfil - Obter dados do perfil
router.get('/dados-perfil', PedidosController.obterDadosPerfil);

export default router;