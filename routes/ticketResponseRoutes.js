import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { validateCreateResponse, validateUpdateResponse } from '../utils/validation.js'
import {
    getTicketResponses,
    addTicketResponse,
    updateTicketResponse,
    deleteTicketResponse
} from '../controllers/ticketResponseController.js'
import auth from '../config/auth.js'

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticateJWT)

// Routes pour la gestion des réponses aux tickets
router.get('/:ticketId/responses', authenticateJWT, getTicketResponses)
router.post('/:ticketId/responses', authenticateJWT, validateCreateResponse, addTicketResponse)
router.put('/responses/:responseId', authenticateJWT, validateUpdateResponse, updateTicketResponse)
router.patch('/responses/:responseId', authenticateJWT, validateUpdateResponse, updateTicketResponse)
router.delete('/responses/:responseId', authenticateJWT, deleteTicketResponse)

export default router