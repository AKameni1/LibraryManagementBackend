import express from 'express'
import { createBook, deleteBook, getAllBooks, getBookById, getBooksByCategory, updateBook } from '../controllers/bookController.js'


const router = express.Router()

router.get('/', getAllBooks)
router.get('/:bookId', getBookById)
router.post('/', createBook)
router.patch('/:bookId', updateBook)
router.delete('/:bookId', deleteBook)
router.get('/category/:categoryId', getBooksByCategory)

export default router