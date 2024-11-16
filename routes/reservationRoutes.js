import express from 'express'
import { cancelReservation, createReservation, getUserReservations } from '../controllers/reservationController.js'
import authenticateJWT from '../middlewares/authMiddleware.js'


const router = express.Router()


router.post('/:userId', authenticateJWT, createReservation)
router.delete('/cancel/:reservationId', authenticateJWT, cancelReservation)
router.get('/user', authenticateJWT, getUserReservations)
// router.post('/notify/:bookId', notifyReservationAvailability)

export default router