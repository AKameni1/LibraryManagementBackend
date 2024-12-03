import express from 'express'
import {
    loginUser,
    logoutUser,
    refreshAccessToken,
} from '../controllers/authController.js'
import { validateAuth } from '../utils/validation.js'
import { auditLogMiddleware } from '../middlewares/auditLogMiddleware.js'
import authenticateJWT from '../middlewares/authMiddleware.js'
import {
    loginLimiter,
    refreshTokenLimiter,
} from '../middlewares/rateLimiter.js'
import { getUserInfo } from '../controllers/userController.js'

const router = express.Router()

router.post(
    '/login',
    loginLimiter,
    validateAuth,
    auditLogMiddleware('Connexion'),
    loginUser
)

router.post(
    '/refresh-token',
    refreshTokenLimiter,
    auditLogMiddleware('GetNewAccessToken'),
    refreshAccessToken
)

router.post('/logout', logoutUser)

router.get('/profile', authenticateJWT, getUserInfo)

export default router
