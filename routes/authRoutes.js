import express from 'express'
import { loginUser, refreshAccessToken } from '../controllers/authController.js'
import { validateAuth } from '../utils/validation.js'
import { auditLogMiddleware } from '../middlewares/auditLogMiddleware.js'


const router = express.Router()

router.post('/login', validateAuth, auditLogMiddleware('Connexion'), loginUser)
router.post('/refresh-token', auditLogMiddleware('GetNewAccessToken'), refreshAccessToken)

export default router