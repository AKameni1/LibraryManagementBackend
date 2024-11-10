import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { validateCreatePermission, validatePermission, validateUpdatePermission } from '../utils/validation.js'
import { createPermission, deletePermission, getPermissions, updatePermission } from '../controllers/permissionController.js'
import { addPermissionToUser, getUserPermissions, revokePermissionFromUser } from '../controllers/userController.js'
import { addPermissionToRole, getPermissionsOfRole, revokePermissionFromRole } from '../controllers/roleController.js'
import { isSuperAdmin } from '../middlewares/isSuperAdmin.js'

const router = express.Router()

router.get('/', authenticateJWT, isSuperAdmin, getPermissions)
router.post('/', authenticateJWT, isSuperAdmin, validateCreatePermission, createPermission)
router.put('/:permissionId', authenticateJWT, isSuperAdmin, validateUpdatePermission, updatePermission)
router.patch('/:permissionId', authenticateJWT, isSuperAdmin, validateUpdatePermission, updatePermission)
router.delete('/:permissionId', authenticateJWT, isSuperAdmin, deletePermission)


// Permission management routes
router.get('/:userId/permissions-user', authenticateJWT, isSuperAdmin, getUserPermissions)
router.post('/:userId/add-permission-user', authenticateJWT, isSuperAdmin, validatePermission, addPermissionToUser)
router.delete('/:userId/revoke-permission-user', authenticateJWT, isSuperAdmin, validatePermission, revokePermissionFromUser)

router.get('/:roleId/permissions-role', authenticateJWT, isSuperAdmin, getPermissionsOfRole)
router.post('/:roleId/add-permission-role', authenticateJWT, isSuperAdmin, validatePermission, addPermissionToRole)
router.delete('/:roleId/revoke-permission-role', authenticateJWT, isSuperAdmin, validatePermission, revokePermissionFromRole)


export default router