import express from 'express';
import authenticateJWT from '../middlewares/authMiddleware.js'; // Middleware pour authentification
import { createTicketResponse, getTicketResponses } from '../controllers/ticketResponseController.js';
import { isCurrentUser } from '../middlewares/authorization.js'; // Vérification que l'utilisateur est le bon

const router = express.Router();

// Récupérer toutes les réponses d'un ticket de support
router.get('/:ticketId', authenticateJWT, getTicketResponses);

// Ajouter une réponse à un ticket de support (seul l'utilisateur peut répondre à ses tickets)
router.post('/:ticketId', authenticateJWT, isCurrentUser, createTicketResponse);

export default router;
