import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import {
    validateCreateResponse,
    validateUpdateResponse,
} from '../utils/validation.js'
import {
    getTicketResponses,
    addTicketResponse,
    updateTicketResponse,
    deleteTicketResponse,
} from '../controllers/ticketResponseController.js'

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticateJWT)

// Routes pour la gestion des réponses aux tickets
router.get('/:ticketId/responses', authenticateJWT, getTicketResponses)
router.post('/:ticketId/responses', validateCreateResponse, addTicketResponse)
router.put(
    '/responses/:responseId',
    validateUpdateResponse,
    updateTicketResponse
)
router.patch(
    '/responses/:responseId',
    validateUpdateResponse,
    updateTicketResponse
)
router.delete('/responses/:responseId', deleteTicketResponse)

export default router
