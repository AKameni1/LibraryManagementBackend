import express from 'express'
import { loginUser, logoutUser, refreshAccessToken } from '../controllers/authController.js'
import { validateAuth } from '../utils/validation.js'
import { auditLogMiddleware } from '../middlewares/auditLogMiddleware.js'


const router = express.Router()

router.post('/login', validateAuth, auditLogMiddleware('Connexion'), loginUser)
router.post('/refresh-token', auditLogMiddleware('GetNewAccessToken'), refreshAccessToken)
router.post('/logout', logoutUser)

export default router