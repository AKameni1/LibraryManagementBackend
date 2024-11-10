import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { getAllRoles, getRoleById, getUsersByRole } from '../controllers/roleController.js'
import { downgradeUser, promoteUser } from '../controllers/userController.js'
import { validateUserRole } from '../utils/validation.js'

const router = express.Router()


// Routes pour les rôles
router.get('/', authenticateJWT, getAllRoles)
router.get('/:roleId', authenticateJWT, getRoleById)
router.get('/usersByRole/:roleName', authenticateJWT, getUsersByRole)

// Routes pour gérer la promotion et la rétrogradation des utilisateurs
router.patch('/:userId/promote', authenticateJWT, validateUserRole, promoteUser)
router.patch('/:userId/downgrade', authenticateJWT, validateUserRole, downgradeUser)

export default router