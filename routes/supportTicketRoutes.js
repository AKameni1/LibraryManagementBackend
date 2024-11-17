// routes/supportTicketRoutes.js
import express from 'express';
import authenticateJWT from '../middlewares/authMiddleware.js';
import { getAllSupportTickets, createSupportTicket, updateSupportTicket, deleteSupportTicket } from '../controllers/supportTicketController.js';
import { isCurrentUser } from '../middlewares/authorization.js';

const router = express.Router();

// Routes pour la gestion des tickets de support
// GET: Liste tous les tickets de support (utilisateur authentifié)
router.get('/', authenticateJWT, getAllSupportTickets);

// POST: Crée un nouveau ticket de support (utilisateur authentifié)
router.post('/', authenticateJWT, createSupportTicket);

// PUT: Modifie un ticket existant (authentification + propriétaire du ticket)
router.put('/:ticketId', authenticateJWT, isCurrentUser, updateSupportTicket);

// DELETE: Supprime un ticket (authentification + propriétaire du ticket)
router.delete('/:ticketId', authenticateJWT, isCurrentUser, deleteSupportTicket);

export default router;