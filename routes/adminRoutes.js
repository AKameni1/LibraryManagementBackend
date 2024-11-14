import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { createSuperAdmin, createUser, deleteUser, getUserById, getUsers, toggleUserActivation } from '../controllers/adminController.js'
import { validateActivationUser, validateCreateUser } from '../utils/validation.js'
import { hasUpdateUserPermission, isAdmin, isSuperAdmin, preventSuperAdminDeletion } from '../middlewares/authorization.js'


const router = express.Router()


router.post('/create-super-admin', validateCreateUser, createSuperAdmin)

// User management routes
router.get('/', authenticateJWT, isAdmin, getUsers)
router.get('/:userId', authenticateJWT, isAdmin, getUserById)
router.post('/create', authenticateJWT, isAdmin, validateCreateUser, createUser)
router.delete('/:userId', authenticateJWT, isSuperAdmin, preventSuperAdminDeletion, deleteUser)


// Activation toggle route
router.patch('/:userId/toggle-activation', authenticateJWT, isAdmin, hasUpdateUserPermission, validateActivationUser, toggleUserActivation)

export default router
