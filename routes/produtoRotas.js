import express from 'express'
import ProdutoController from '../controllers/produtoController.js'
import PageController from  '../controllers/pageController.js'
const router = express.Router()

router.get('/',  PageController.paginaProduto)

export default router