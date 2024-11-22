import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import {
    createSuperAdmin,
    createUser,
    deleteUser,
    getUserById,
    getUsers,
    toggleUserActivation,
} from '../controllers/adminController.js'
import {
    validateActivationUser,
    validateCreateUser,
} from '../utils/validation.js'
import {
    hasUpdateUserPermission,
    isAdmin,
    isSuperAdmin,
    restrictSuperAdminCreation,
    preventSuperAdminDeletion,
} from '../middlewares/authorization.js'
import { auditLogMiddleware } from '../middlewares/auditLogMiddleware.js'

const router = express.Router()

router.post(
    '/create-super-admin',
    restrictSuperAdminCreation,
    validateCreateUser,
    createSuperAdmin
)

router.use(auditLogMiddleware('userAction'))

// User management routes
router.get('/', authenticateJWT, isAdmin, getUsers)
router.get('/:userId', authenticateJWT, isAdmin, getUserById)
router.post(
    '/create',
    authenticateJWT,
    isAdmin,
    validateCreateUser,
    auditLogMiddleware('createUser'),
    createUser
)
router.delete(
    '/:userId',
    authenticateJWT,
    isSuperAdmin,
    preventSuperAdminDeletion,
    auditLogMiddleware('deleteUser'),
    deleteUser
)

// Activation toggle route
router.patch(
    '/:userId/toggle-activation',
    authenticateJWT,
    isAdmin,
    hasUpdateUserPermission,
    validateActivationUser,
    auditLogMiddleware('activation/désactivation du user account'),
    toggleUserActivation
)

export default router
