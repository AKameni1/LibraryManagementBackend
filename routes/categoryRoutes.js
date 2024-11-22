import express from 'express'
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
} from '../controllers/categoryController.js'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { isLibrarian } from '../middlewares/authorization.js'
import { auditLogMiddleware } from '../middlewares/auditLogMiddleware.js'

const router = express.Router()

router.use(auditLogMiddleware('categoryAction'))

router.get('/', authenticateJWT, getAllCategories)
router.get('/:categoryId', authenticateJWT, getCategoryById)
router.post('/', authenticateJWT, isLibrarian, auditLogMiddleware('createCategory'), createCategory)
router.patch('/:categoryId', authenticateJWT, isLibrarian, auditLogMiddleware('updateCategory'), updateCategory)
router.delete('/:categoryId', authenticateJWT, isLibrarian, auditLogMiddleware('deleteCategory'), deleteCategory)

export default router
