import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import {
    validateCreateTicket,
    validateUpdateTicketStatus,
} from '../utils/validation.js'
import {
    getTickets,
    getTicketById,
    createTicket,
    updateTicketStatus,
    searchTickets,
} from '../controllers/supportTicketController.js'
import { auditLogMiddleware } from '../middlewares/auditLogMiddleware.js'

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticateJWT)

// Routes pour la gestion des tickets
router.get('/', getTickets) // Admin voit tout, utilisateur voit ses tickets
router.get('/search', searchTickets) // Recherche de tickets avec filtres
router.get('/:ticketId', getTicketById)
router.post(
    '/',
    validateCreateTicket,
    auditLogMiddleware('createTicket'),
    createTicket
)
router.patch(
    '/:ticketId/status',
    validateUpdateTicketStatus,
    auditLogMiddleware('udpateTicket'),
    updateTicketStatus
)

export default router
