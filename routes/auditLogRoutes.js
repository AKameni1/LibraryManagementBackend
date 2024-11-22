import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { isAdmin, isSuperAdmin } from '../middlewares/authorization.js'
import {
    getAuditLogs,
    getAuditLogsByUser,
} from '../controllers/auditLogController.js'

const router = express.Router()

router.get('/', authenticateJWT, isSuperAdmin, getAuditLogs)
router.get('/user/:userId', authenticateJWT, isSuperAdmin, getAuditLogsByUser)

export default router
