import cron from 'node-cron'
import { Reservation, User, Book } from '../models/index.js'
import { sendEmailNotification } from './notificationHelper.js'


cron.schedule('0 0 * * *', () => {
    cancelExpiredReservationsAndMakeBooksAvailable()
})


cron.schedule('0 0 1 */6 *', () => {
    reducePenaltyPoints()
})

cron.schedule('0 0 1 */6 *', () => {
    rewardRegularUsers()
})


const cancelExpiredReservationsAndMakeBooksAvailable = async () => {
    try {
        const expiredReservations = await Reservation.findAll({
            where: {
                Status: 'Reserved',
                ReservationEndDate: {
                    [Sequelize.Op.lt]: new Date(),
                }
            }
        })

        // Vérification si des réservations expirées existent
        if (expiredReservations.length > 0) {
            try {
                const promises = expiredReservations.map(async (reservation) => {
                    // Annuler la réservation
                    await reservation.update({ Status: 'Cancelled' })

                    // Rendre le livre disponible
                    const book = await Book.findByPk(reservation.BookID)
                    if (book) {
                        await book.update({ Status: 'Available' })
                        console.log(`Livre ${book.BookID} marqué comme disponible.`)
                    }

                    console.log(`Réservation ${reservation.ReservationID} annulée, expirée.`)
                })

                await Promise.all(promises)

                // Log des réservations annulées
                expiredReservations.forEach(reservation => {
                    console.log(`Réservation ${reservation.ReservationID} annulée, expirée.`)
                })
            } catch (updateError) {
                // Si une erreur survient lors de la mise à jour des réservations
                console.error('Erreur lors de la mise à jour des réservations:', updateError)
                // Je peux également envoyer l'erreur à un service de monitoring ou de logs externe
            }
        } else {
            console.log('Aucune réservation expirée à annuler.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'annulation des réservations expirées:', error)

        // Gestion d'erreurs spécifiques
        if (error instanceof Sequelize.DatabaseError) {
            console.error('Erreur de base de données:', error.message)
        } else if (error instanceof Sequelize.ValidationError) {
            console.error('Erreur de validation:', error.errors)
        } else {
            console.error('Erreur générale:', error.message)
        }
    }
}


const reducePenaltyPoints = async () => {
    try {
        // Trouver tous les utilisateurs dont les points de pénalité sont au-dessus de 0
        const users = await User.findAll({
            where: {
                PenaltyPoints: { [Op.gt]: 0 },
                LateReturnCount: 0
            }
        })

        // Appliquer une réduction des points de pénalité pour les utilisateurs sans retards
        for (const user of users) {
            const newPenaltyPoints = Math.max(user.PenaltyPoints - 5, 0)
            user.PenaltyPoints = newPenaltyPoints
            await user.save()
        }

        // Retourner un succès
        console.log('Points de pénalité réduits avec succès pour les utilisateurs en règle.')
    } catch (error) {
        console.error('Erreur lors de la réduction des points de pénalité', error)
    }
}


const rewardRegularUsers = async () => {
    try {
        const users = await User.findAll({
            where: {
                LateReturnCount: 0,
                PenaltyPoints: 0  
            }
        })

        for (const user of users) {
            // Récompenser l'utilisateur en augmentant le LoanLimit
            user.LoanLimit += 1
            await user.save()

            sendEmailNotification(user.UserID, 'Récompenses appliquées pour les utilisateurs réguliers.', 'Vous avez reçu une récompense pour bonne régularité.')
        }

        console.log('Récompenses appliquées pour les utilisateurs réguliers.')
    } catch (error) {
        console.error('Erreur lors de la récompense des utilisateurs réguliers', error)
    }
}