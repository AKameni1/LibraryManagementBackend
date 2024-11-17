// routes/adminRoutes.js
import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { createSuperAdmin, createUser, deleteUser, getUserById, getUsers, toggleUserActivation } from '../controllers/adminController.js'
import { validateActivationUser, validateCreateUser } from '../utils/validation.js'
import { hasUpdateUserPermission, isAdmin, isSuperAdmin, preventSuperAdminDeletion } from '../middlewares/authorization.js'

const router = express.Router()

// Route spéciale - création du super administrateur initial
// POST: Crée le premier super admin (route unique)
router.post('/create-super-admin', validateCreateUser, createSuperAdmin)

// Routes de gestion des utilisateurs (admin requis)
// GET: Liste tous les utilisateurs
router.get('/', authenticateJWT, isAdmin, getUsers)

// GET: Récupère un utilisateur par son ID
router.get('/:userId', authenticateJWT, isAdmin, getUserById)

// POST: Crée un nouvel utilisateur
router.post('/create', authenticateJWT, isAdmin, validateCreateUser, createUser)

// DELETE: Supprime un utilisateur (super admin uniquement)
// Middleware spécial pour empêcher la suppression d'un super admin
router.delete('/:userId', authenticateJWT, isSuperAdmin, preventSuperAdminDeletion, deleteUser)

// Route de gestion du statut utilisateur
// PATCH: Active/désactive un compte utilisateur
// Nécessite: admin + permission de mise à jour
router.patch('/:userId/toggle-activation',
    authenticateJWT,
    isAdmin,
    hasUpdateUserPermission,
    validateActivationUser,
    toggleUserActivation
)

export default router