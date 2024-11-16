import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { isAdmin } from '../middlewares/authorization.js'
import {
    createReport,
    getReports,
    getReportById,
    deleteReport
} from '../controllers/reportController.js'
import { validateCreateReport } from '../utils/validation.js'

const router = express.Router()

router.post('/', authenticateJWT, isAdmin, validateCreateReport, createReport)
router.get('/', authenticateJWT, isAdmin, getReports)
router.get('/:reportId', authenticateJWT, isAdmin, getReportById)
router.delete('/:reportId', authenticateJWT, isAdmin, deleteReport)

export default router