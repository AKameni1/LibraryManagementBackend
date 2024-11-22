import express from 'express'
import { cancelReservation, createReservation, getUserReservations } from '../controllers/reservationController.js'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { auditLogMiddleware } from '../middlewares/auditLogMiddleware.js'


const router = express.Router()


router.post('/:userId', authenticateJWT, auditLogMiddleware('createReservation'), createReservation)
router.delete('/cancel/:reservationId', authenticateJWT, auditLogMiddleware('deleteReservation'), cancelReservation)
router.get('/user', authenticateJWT, getUserReservations)
// router.post('/notify/:bookId', notifyReservationAvailability)

export default router