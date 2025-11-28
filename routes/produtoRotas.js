import express from 'express'
import ProdutoController from '../controllers/produtoController.js'
import { uploadImagens, handleUploadError } from '../middlewares/uploadMiddleware.js';
const router = express.Router()

router.get('/listar', ProdutoController.ListarProdutos)
router.get('/listar/id/:id', ProdutoController.buscarPorId)
router.get('/listar/:categoria', ProdutoController.buscarPorCategoria)
router.post('/criar', uploadImagens.single('imagem'), handleUploadError, ProdutoController.criar)


export default router