import sequelize from '../config/db.js'
import { Loan, Book, Reservation, User } from '../models/index.js'
import { handleError } from '../utils/handleError.js'
import { sendEmailNotification } from '../utils/notificationHelper.js'
import { updateActivationUserAccount } from './adminController.js'

// Emprunter un livre
export const borrowBook = async (req, res) => {
    const { userId } = req.params
    const { bookId, endDate } = req.body
    try {
        const bookAvailable = await checkBookAvailability(bookId)
        if (!bookAvailable) {
            return res
                .status(400)
                .json({ message: 'Le livre est déjà emprunté ou reservé.' })
        }

        const user = await User.findByPk(userId)

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' })
        }
        // Vérifier si l'utilisateur a une suspension active
        if (user.LoanSuspendedUntil !== null) {
            const suspensionEndDate = new Date(user.LoanSuspendedUntil)

            // Si la date actuelle est avant la date de fin de suspension, l'emprunt est interdit
            if (new Date() < suspensionEndDate) {
                return res.status(403).json({
                    message: `Votre compte est suspendu jusqu'au ${suspensionEndDate.toLocaleDateString()}. Vous ne pouvez pas emprunter de livres.`,
                })
            }
        }

        if (user.LoanCount > user.LoanLimit) {
            return res.status(403).json({
                message:
                    "Vous avez atteint le nombre maximal d'emprunt. Vous ne pouvez pas emprunter de livres.",
            })
        }

        const loan = await Loan.create({
            UserID: userId,
            BookID: bookId,
            EndDate: endDate,
            StartDate: new Date().toLocaleDateString(),
        })

        const book = await Book.findByPk(bookId)
        book.Availability = 'Borrowed'
        await book.save()

        user.LoanCount += 1
        await user.save()

        res.status(201).json({ loan })
    } catch (error) {
        handleError(res, 'Erreur du serveur.', error)
    }
}

// Retourner un livre
export const returnBook = async (req, res) => {
    const { loanId } = req.params
    try {
        const loan = await Loan.findByPk(loanId)
        if (!loan || loan.Status !== 'Borrowed') {
            return res
                .status(400)
                .json({ message: 'Aucun emprunt actif trouvé pour ce livre.' })
        }

        loan.Status = 'Returned'
        loan.ReturnDate = new Date()
        await loan.save()

        const book = await Book.findByPk(loan.BookID)
        book.Availability = 'Available'
        await book.save()

        if (loan.Status === 'Returned' && loan.ReturnDate > loan.EndDate) {
            const user = await User.findByPk(loan.UserID)
            user.LateReturnCount += 1

            if (user.LateReturnCount < 3) {
                updateActivationUserAccount(user.UserID)
                sendEmailNotification(
                    user.UserID,
                    'Suspension de votre compte',
                    'Vous avez accumulé un grand nombre de retard au niveau des retours.'
                )
            }
            await user.save()
        }

        res.status(200).json({ message: 'Livre retourné avec succès.' })
    } catch (error) {
        handleError(res, 'Erreur du serveur.', error)
    }
}

// Extension de prêt
export const extendLoan = async (req, res) => {
    const { loanId } = req.params
    const { newEndDate } = req.body
    try {
        const loan = await Loan.findByPk(loanId)
        if (loan.Status !== 'Borrowed') {
            return res.status(400).json({ message: "Le prêt n'est pas actif." })
        }
        await loan.update({ EndDate: newEndDate })
        await loan.save()
        res.status(200).json({ message: 'Date de retour étendue avec succès.' })
    } catch (error) {
        handleError(res, 'Erreur du serveur.', error)
    }
}

// Historique d'emprunt
export const getLoanHistory = async (req, res) => {
    const { userId } = req.user
    // Paramètres de pagination
    const page = Math.max(1, parseInt(req.query.page) || 1) // Minimum : 1
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)) // Limité entre 1 et 100
    const offset = (page - 1) * limit

    try {
        const { rows: history, count: total } = await Loan.findAndCountAll({
            where: { UserID: userId },
            limit: limit,
            offset: offset,
            order: [['StartDate', 'DESC']],
        })

        res.status(200).json({
            total: total, // Nombre total de prêts
            page: parseInt(page), // Page actuelle
            limit: parseInt(limit), // Limite par page
            totalPages: Math.ceil(total / limit), // Nombre total de pages
            history: history, // Liste des prêts pour cette page
        })
    } catch (error) {
        handleError(res, 'Erreur du serveur.', error)
    }
}

// Rapport d'utilisation
export const getBookUsageReport = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1) // Page minimum 1
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)) // Limité entre 1 et 100
    const offset = (page - 1) * limit
    try {
        const { rows: report, count: total } = await Loan.findAndCountAll({
            attributes: [
                'BookID',
                [sequelize.fn('COUNT', sequelize.col('LoanID')), 'LoanCount'],
            ],
            include: [
                {
                    model: Book,
                    attributes: ['Title', 'Author'], // Ajouter des colonnes nécessaires
                },
            ],
            group: ['BookID', 'Book.BookID'], // Groupement pour éviter les doublons
            order: [[sequelize.literal('LoanCount'), 'DESC']], // Trier par nombre d'emprunts
            limit: limit,
            offset: offset,
        })

        res.status(200).json({
            total: total, // Nombre total de livres dans le rapport
            page: parseInt(page), // Page actuelle
            limit: parseInt(limit), // Limite par page
            totalPages: Math.ceil(total / limit), // Nombre total de pages
            report: report, // Résultats paginés
        })
    } catch (error) {
        handleError(res, 'Erreur du serveur.', error)
    }
}

// Vérification de la disponibilité d'un livre (méthode s'executant en interne)
export const checkBookAvailability = async (bookId) => {
    const book = await Book.findByPk(bookId)
    if (!book) return false

    const isBookBorrowed = await Loan.findOne({
        where: { BookID: bookId, Status: 'Borrowed' },
    })
    const isBookReserved = await Reservation.findOne({
        where: { BookID: bookId, Status: 'Reserved' },
    })

    return !(isBookBorrowed || isBookReserved)
}
