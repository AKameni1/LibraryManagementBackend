import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { isAdmin } from '../middlewares/authorization.js'
import { validateCreateFAQ, validateUpdateFAQ } from '../utils/validation.js'
import {
    getAllFAQs,
    getFAQById,
    createFAQ,
    updateFAQ,
    deleteFAQ
} from '../controllers/faqController.js'

const router = express.Router()

// Routes publiques (pas besoin d'authentification)
router.get('/', getAllFAQs)
router.get('/:faqId', getFAQById)

// Routes protégées (admin seulement)
router.post('/', authenticateJWT, isAdmin, validateCreateFAQ, createFAQ)
router.put('/:faqId', authenticateJWT, isAdmin, validateUpdateFAQ, updateFAQ)
router.patch('/:faqId', authenticateJWT, isAdmin, validateUpdateFAQ, updateFAQ)
router.delete('/:faqId', authenticateJWT, isAdmin, deleteFAQ)

export default router