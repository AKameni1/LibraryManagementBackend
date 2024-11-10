import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { getAllRoles, getRoleById, getUsersByRole } from '../controllers/roleController.js'
import { downgradeUser, promoteUser } from '../controllers/userController.js'
import { validateUserRole } from '../utils/validation.js'
import { isAdmin, isSuperAdmin } from '../middlewares/authorization.js'

const router = express.Router()


// Routes pour les rôles
router.get('/', authenticateJWT, isSuperAdmin, getAllRoles)
router.get('/:roleId', authenticateJWT, isSuperAdmin, getRoleById)
router.get('/usersByRole/:roleName', authenticateJWT, isAdmin, getUsersByRole)

// Routes pour gérer la promotion et la rétrogradation des utilisateurs
router.patch('/:userId/promote', authenticateJWT, isSuperAdmin, validateUserRole, promoteUser)
router.patch('/:userId/downgrade', authenticateJWT, isSuperAdmin, validateUserRole, downgradeUser)

export default router