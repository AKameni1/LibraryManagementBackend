// routes/ticketResponseRoutes.js
import express from 'express';
import authenticateJWT from '../middlewares/authMiddleware.js';
import { createTicketResponse, getTicketResponses } from '../controllers/ticketResponseController.js';
import { isCurrentUser } from '../middlewares/authorization.js';

const router = express.Router();

// Routes pour la gestion des réponses aux tickets
// GET: Récupère toutes les réponses d'un ticket spécifique
router.get('/:ticketId', authenticateJWT, getTicketResponses);

// POST: Crée une nouvelle réponse pour un ticket
// Nécessite: authentification JWT + être l'utilisateur concerné
router.post('/:ticketId', authenticateJWT, isCurrentUser, createTicketResponse);

export default router;