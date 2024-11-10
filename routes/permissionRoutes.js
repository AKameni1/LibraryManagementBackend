import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { validateCreatePermission, validatePermission, validateUpdatePermission } from '../utils/validation.js'
import { createPermission, deletePermission, getPermissions, updatePermission } from '../controllers/permissionController.js'
import { addPermissionToUser, getUserPermissions, revokePermissionFromUser } from '../controllers/userController.js'
import { addPermissionToRole, getPermissionsOfRole, revokePermissionFromRole } from '../controllers/roleController.js'

const router = express.Router()

router.get('/', authenticateJWT, getPermissions)
router.post('/', authenticateJWT, validateCreatePermission, createPermission)
router.put('/:permissionId', authenticateJWT, validateUpdatePermission, updatePermission)
router.patch('/:permissionId', authenticateJWT, validateUpdatePermission, updatePermission)
router.delete('/:permissionId', authenticateJWT, deletePermission)


// Permission management routes
router.get('/:userId/permissions-user', authenticateJWT, getUserPermissions)
router.post('/:userId/add-permission-user', authenticateJWT, validatePermission, addPermissionToUser)
router.delete('/:userId/revoke-permission-user', authenticateJWT, validatePermission, revokePermissionFromUser)

router.get('/:roleId/permissions-role', authenticateJWT, getPermissionsOfRole)
router.post('/:roleId/add-permission-role', authenticateJWT, validatePermission, addPermissionToRole)
router.delete('/:roleId/revoke-permission-role', authenticateJWT, validatePermission, revokePermissionFromRole)


export default router