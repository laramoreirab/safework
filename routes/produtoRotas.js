import express from 'express'
import ProdutoController from '../controllers/produtoController.js'
import { uploadImagens, handleUploadError } from '../middlewares/uploadMiddleware.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js'
const router = express.Router()

router.get('/listar', ProdutoController.ListarProdutos)
router.get('/listar/id/:id', ProdutoController.buscarPorId)
router.get('/listar/:categoria', ProdutoController.buscarPorCategoria)
router.put('/atualizar',  uploadImagens.single('imagem'), handleUploadError, ProdutoController.atualizar )
router.post('/criar', uploadImagens.single('imagem'), handleUploadError, ProdutoController.criar)
router.delete('/excluir/:id/:img', ProdutoController.excluirProduto)


export default router