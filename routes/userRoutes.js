import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { createSuperAdmin, createUser, deleteUser, getUserById, getUserInfo, getUsers, toggleUserActivation, updateUser } from '../controllers/userController.js'
import { validateActivationUser, validateCreateUser, validateUpdateUser } from '../utils/validation.js'
import { isSuperAdmin } from '../middlewares/isSuperAdmin.js'


const router = express.Router()

// Profile route
router.get('/profile', authenticateJWT, getUserInfo)

router.post('/create-super-admin', validateCreateUser, createSuperAdmin)

// User management routes
router.get('/', authenticateJWT, getUsers)
router.get('/:userId', authenticateJWT, getUserById)
router.post('/create', validateCreateUser, createUser)
router.put('/:userId', authenticateJWT, validateUpdateUser, updateUser)
router.patch('/:userId', authenticateJWT, validateUpdateUser, updateUser)
router.delete('/:userId', authenticateJWT, isSuperAdmin, deleteUser)


// Activation toggle route
router.patch('/:userId/toggle-activation', authenticateJWT, isSuperAdmin, validateActivationUser, toggleUserActivation)


export default router