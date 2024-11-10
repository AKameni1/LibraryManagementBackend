import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { createSuperAdmin, createUser, deleteUser, getUserById, getUserInfo, getUsers, toggleUserActivation, updateUser } from '../controllers/userController.js'
import { validateActivationUser, validateCreateUser, validateUpdateUser } from '../utils/validation.js'
import { hasUpdateUserPermission, isAdmin, isCurrentUser, isSuperAdmin, preventSuperAdminDeletion } from '../middlewares/authorization.js'


const router = express.Router()

// Profile route
router.get('/profile', authenticateJWT, getUserInfo)

router.post('/create-super-admin', validateCreateUser, createSuperAdmin)

// User management routes
router.get('/', authenticateJWT, isAdmin, getUsers)
router.get('/:userId', authenticateJWT, isAdmin, getUserById)
router.post('/create', authenticateJWT, isAdmin, validateCreateUser, createUser)
router.put('/:userId', authenticateJWT, isCurrentUser, validateUpdateUser, updateUser)
router.patch('/:userId', authenticateJWT, isCurrentUser, validateUpdateUser, updateUser)
router.delete('/:userId', authenticateJWT, isSuperAdmin, preventSuperAdminDeletion, deleteUser)


// Activation toggle route
router.patch('/:userId/toggle-activation', authenticateJWT, isAdmin, hasUpdateUserPermission, validateActivationUser, toggleUserActivation)


export default router