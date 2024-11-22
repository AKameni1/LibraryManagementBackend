import express from 'express'
import {
    createBook,
    deleteBook,
    getAllBooks,
    getBookById,
    getBooksByCategory,
    updateBook,
} from '../controllers/bookController.js'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { isLibrarian } from '../middlewares/authorization.js'

const router = express.Router()

router.all('*', authenticateJWT, isLibrarian)
router.get('/', getAllBooks)
router.get('/:bookId', getBookById)
router.post('/', createBook)
router.patch('/:bookId', updateBook)
router.delete('/:bookId', deleteBook)
router.get('/category/:categoryId', getBooksByCategory)

export default router
