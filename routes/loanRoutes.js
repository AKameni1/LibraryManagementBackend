import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import {
    borrowBook,
    extendLoan,
    getBookUsageReport,
    getLoanHistory,
    returnBook,
} from '../controllers/loanController.js'
import { isLibrarian } from '../middlewares/authorization.js'
import { auditLogMiddleware } from '../middlewares/auditLogMiddleware.js'

const router = express.Router()

router.post(
    '/:userId/borrow',
    authenticateJWT,
    auditLogMiddleware('borrowBook'),
    borrowBook
)
router.post(
    '/return/:loanId',
    authenticateJWT,
    auditLogMiddleware('returnBook'),
    returnBook
)
router.post(
    '/extend/:loanId',
    authenticateJWT,
    auditLogMiddleware('extendLoan'),
    extendLoan
)
router.get('/history', authenticateJWT, getLoanHistory)
router.get('/report', authenticateJWT, isLibrarian, getBookUsageReport)

// S'execute en interne
// router.get('/availability/:bookId', authenticateJWT, checkBookAvailability)

export default router
