import sequelize from '../config/db.js'
import { Loan, Book, Reservation, User } from '../models/index.js'
import { handleError } from '../utils/handleError.js'
import { sendEmailNotification } from '../utils/notificationHelper.js'
import { updateActivationUserAccount } from './userController.js'


// Emprunter un livre
export const borrowBook = async (req, res) => {
    const { userId } = req.params
    const { bookId, endDate } = req.body
    try {
        const bookAvailable = await checkBookAvailability(bookId)
        if (!bookAvailable) {
            return res.status(400).json({ message: "Le livre est déjà emprunté ou reservé." })
        }

        const user = await User.findByPk(userId)

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }
        // Vérifier si l'utilisateur a une suspension active
        if (user.LoanSuspendedUntil !== null) {
            const suspensionEndDate = new Date(user.LoanSuspendedUntil)

            // Si la date actuelle est avant la date de fin de suspension, l'emprunt est interdit
            if (new Date() < suspensionEndDate) {
                return res.status(403).json({
                    message: `Votre compte est suspendu jusqu'au ${suspensionEndDate.toLocaleDateString()}. Vous ne pouvez pas emprunter de livres.`
                })
            }
        }

        if (user.LoanCount > user.LoanLimit) {
            return res.status(403).json({ message: 'Vous avez atteint le nombre maximal d\'emprunt. Vous ne pouvez pas emprunter de livres.' })
        }

        const loan = await Loan.create({ UserID: userId, BookID: bookId, EndDate: endDate, StartDate: new Date().toLocaleDateString() })

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
            return res.status(400).json({ message: 'Aucun emprunt actif trouvé pour ce livre.' })
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
                sendEmailNotification(user.UserID, 'Suspension de votre compte', 'Vous avez accumulé un grand nombre de retard au niveau des retours.')
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
    try {
        const history = await Loan.findAll({ where: { UserID: userId } })
        res.status(200).json(history)
    } catch (error) {
        handleError(res, 'Erreur du serveur.', error)
    }
}

// Rapport d'utilisation
export const getBookUsageReport = async (req, res) => {
    try {
        const report = await Loan.findAll({
            attributes: [
                'BookID',
                [sequelize.fn('COUNT', sequelize.col('LoanID')), 'LoanCount']                
            ],
            group: ['BookID']
        })
        res.status(200).json(report)
    } catch (error) {
        handleError(res, 'Erreur du serveur.', error)
    }
}

// Vérification de la disponibilité d'un livre (méthode s'executant en interne)
export const checkBookAvailability = async (bookId) => {
    const book = await Book.findByPk(bookId)
    if (!book) return false

    const isBookBorrowed = await Loan.findOne({ where: { BookID: bookId, Status: 'Borrowed' } })
    const isBookReserved = await Reservation.findOne({ where: { BookID: bookId, Status: 'Reserved' } })

    return !(isBookBorrowed || isBookReserved)
}