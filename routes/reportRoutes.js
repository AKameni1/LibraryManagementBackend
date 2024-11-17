// routes/reportRoutes.js
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

// Routes pour la gestion des rapports (accès administrateur uniquement)

// POST: Crée un nouveau rapport
// Middleware: JWT + Admin + Validation
router.post('/', authenticateJWT, isAdmin, validateCreateReport, createReport)

// GET: Récupère tous les rapports
router.get('/', authenticateJWT, isAdmin, getReports)

// GET: Récupère un rapport spécifique par son ID
router.get('/:reportId', authenticateJWT, isAdmin, getReportById)

// DELETE: Supprime un rapport existant
router.delete('/:reportId', authenticateJWT, isAdmin, deleteReport)

export default router