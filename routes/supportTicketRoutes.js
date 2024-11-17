import express from 'express';
import authenticateJWT from '../middlewares/authMiddleware.js'; // Middleware pour authentification
import { getAllSupportTickets, createSupportTicket, updateSupportTicket, deleteSupportTicket } from '../controllers/supportTicketController.js';
import { isCurrentUser } from '../middlewares/authorization.js'; // Vérification que l'utilisateur est le bon

const router = express.Router();

// Récupérer tous les tickets de support de l'utilisateur
router.get('/', authenticateJWT, getAllSupportTickets);

// Créer un nouveau ticket de support
router.post('/', authenticateJWT, createSupportTicket);

// Mettre à jour un ticket de support existant (seul l'utilisateur qui l'a créé peut le faire)
router.put('/:ticketId', authenticateJWT, isCurrentUser, updateSupportTicket);

// Supprimer un ticket de support (seul l'utilisateur qui l'a créé peut le faire)
router.delete('/:ticketId', authenticateJWT, isCurrentUser, deleteSupportTicket);

export default router;
