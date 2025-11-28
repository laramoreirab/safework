import express from 'express'
import ProdutoController from '../controllers/produtoController.js'
const router = express.Router()

router.get('/listar', ProdutoController.ListarProdutos)
router.get('/listar/id/:id', ProdutoController.buscarPorId)
router.get('/listar/:categoria', ProdutoController.buscarPorCategoria)

export default router