import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { isAdmin } from '../middlewares/authorization.js'
import {
    getAuditLogs,
    getAuditLogsByUser
} from '../controllers/auditLogController.js'

const router = express.Router()

router.get('/', authenticateJWT, isAdmin, getAuditLogs)
router.get('/user/:userId', authenticateJWT, isAdmin, getAuditLogsByUser)

export default router