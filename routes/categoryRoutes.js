import express from 'express'
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/categoryController.js'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { isLibrarian } from '../middlewares/authorization.js'


const router = express.Router()

router.get('/', authenticateJWT, isLibrarian, getAllCategories)
router.get('/:categoryId', authenticateJWT, isLibrarian, getCategoryById)
router.post('/', authenticateJWT, isLibrarian, createCategory)
router.patch('/:categoryId', authenticateJWT, isLibrarian, updateCategory)
router.delete('/:categoryId', authenticateJWT, isLibrarian, deleteCategory)

export default router