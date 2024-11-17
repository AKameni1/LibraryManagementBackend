// routes/reservationRoutes.js
import express from 'express'
import { cancelReservation, createReservation, getUserReservations } from '../controllers/reservationController.js'
import authenticateJWT from '../middlewares/authMiddleware.js'

const router = express.Router()

// Routes pour la gestion des réservations
// POST: Crée une nouvelle réservation pour un utilisateur spécifique
router.post('/:userId', authenticateJWT, createReservation)

// DELETE: Annule une réservation existante
router.delete('/cancel/:reservationId', authenticateJWT, cancelReservation)

// GET: Récupère toutes les réservations de l'utilisateur connecté
router.get('/user', authenticateJWT, getUserReservations)

// Route désactivée - Notification de disponibilité
// router.post('/notify/:bookId', notifyReservationAvailability)

export default router