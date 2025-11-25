import express from 'express'
import authController from '../controllers/authController.js'
import path from 'path'
const router = express.Router()


router.post('/login', authController.login);
router.post('/registrar', authController.registrar);

export default router;