import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { isAdmin } from '../middlewares/authorization.js'
import { validateCreateTicket, validateUpdateTicketStatus } from '../utils/validation.js'
import {
    getTickets,
    getTicketById,
    createTicket,
    updateTicketStatus,
    searchTickets
} from '../controllers/supportTicketController.js'
import { auditLogMiddleware } from '../middlewares/auditLogMiddleware.js'

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticateJWT)

// Routes pour la gestion des tickets
router.get('/', authenticateJWT, getTickets) // Admin voit tout, utilisateur voit ses tickets
router.get('/search', authenticateJWT, searchTickets) // Recherche de tickets avec filtres
router.get('/:ticketId', authenticateJWT, getTicketById)
router.post('/', authenticateJWT, validateCreateTicket, auditLogMiddleware('createTicket'), createTicket)
router.patch('/:ticketId/status', authenticateJWT, validateUpdateTicketStatus, auditLogMiddleware('udpateTicket'), updateTicketStatus)

export default router