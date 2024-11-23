import { Reservation, Book } from '../models/index.js'
import { handleError } from '../utils/handleError.js'
// import { sendEmailNotification } from '../utils/notificationHelper.js'
import { checkBookAvailability } from './loanController.js'

// Créer une réservation
export const createReservation = async (req, res) => {
    const { userId } = req.params
    const { bookId, reservationEndDate } = req.body
    try {
        const endDate =
            reservationEndDate ||
            new Date(new Date().setDate(new Date().getDate() + 7))

        const bookStatus = await checkBookAvailability(bookId)
        if (!bookStatus) {
            return res
                .status(400)
                .json({ message: 'Le livre est déjà réservé ou emprunté.' })
        }
        const book = await Book.findByPk(bookId)
        book.update({ Availability: 'Reserved' })

        const reservation = await Reservation.create({
            UserID: userId,
            BookID: bookId,
            ReservationEndDate: endDate,
        })
        res.status(201).json({ reservation })
    } catch (error) {
        handleError(res, 'Erreur du serveur.', error)
    }
}

// Annuler une réservation
export const cancelReservation = async (req, res) => {
    const { reservationId } = req.params
    try {
        const reservation = await Reservation.findByPk(reservationId)
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée.' })
        }

        if (reservation.Status !== 'Reserved') {
            return res.status(400).json({
                message: 'Cette réservation ne peut pas être annulée.',
            })
        }

        await reservation.update({ Status: 'Cancelled' })
        const book = await Book.findByPk(reservation.BookID)
        if (book) {
            await book.update({ Status: 'Available' })
            console.log(`Livre ${book.BookID} marqué comme disponible.`)
        }
        res.status(200).json({ message: 'Réservation annulée.' })
    } catch (error) {
        handleError(res, 'Erreur du serveur.', error)
    }
}

// Voir les réservations de l'utilisateur
export const getUserReservations = async (req, res) => {
    const { userId } = req.user

    const page = Math.max(1, parseInt(req.query.page) || 1) // Minimum : 1
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)) // Limité entre 1 et 100
    const offset = (page - 1) * limit

    try {
        const { rows: reservations, count: total } =
            await Reservation.findAndCountAll({
                where: { UserID: userId },
                limit: limit,
                offset: offset,
                order: [['CreatedAt', 'DESC']],
            })

        res.status(200).json({
            total: total, // Nombre total de réservations
            page: parseInt(page), // Page actuelle
            limit: parseInt(limit), // Limite par page
            totalPages: Math.ceil(total / limit), // Nombre total de pages
            reservations: reservations, // Liste des réservations pour cette page
        })
    } catch (error) {
        handleError(res, 'Erreur du serveur.', error)
    }
}

// Notifier un utilisateur de la disponibilité du livre réservé
// export const notifyReservationAvailability = async (req, res) => {
//     const { bookId } = req.params
//     try {
//         const reservation = await Reservation.findOne({
//             where: { BookID: bookId, Status: 'Reserved' },
//             // include: {
//             //     model: User,
//             //     as: 'User',
//             //     attributes: ['UserID']
//             // }
//         })

//         console.log('Reservation:', reservation);
//         console.log('User in Reservation:', reservation ? reservation.User : 'No user found')

//         // Vérifier si l'utilisateur est lié à la réservation
//         // if (!reservation.User) {
//         //     return res.status(404).json({ message: 'Utilisateur associé non trouvé pour cette réservation.' });
//         // }

//         if (!reservation) {
//             res.status(404).json({ message: 'Aucune réservation trouvée pour ce livre.' })
//         }

//         await sendEmailNotification(reservation.UserID, 'Votre livre réservé est disponible', 'Le livre est maintenant disponible.')
//         reservation.Status = 'Notification Sent'
//         await reservation.save()
//         res.status(200).json({ message: 'Notification envoyée avec succès.' })
//     } catch (error) {
//         handleError(res, 'Erreur du serveur.', error)
//     }
// }
