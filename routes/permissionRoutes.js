import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { validateCreatePermission, validatePermission, validateUpdatePermission } from '../utils/validation.js'
import { createPermission, deletePermission, getPermissions, updatePermission } from '../controllers/permissionController.js'
import { addPermissionToUser, getUserPermissions, revokePermissionFromUser } from '../controllers/adminController.js'
import { addPermissionsToRole, getPermissionsOfRole, revokePermissionsFromRole } from '../controllers/roleController.js'
import { isSuperAdmin } from '../middlewares/authorization.js'
import { auditLogMiddleware } from '../middlewares/auditLogMiddleware.js'

const router = express.Router()

router.get('/', authenticateJWT, isSuperAdmin, getPermissions)
router.post('/', authenticateJWT, isSuperAdmin, validateCreatePermission, createPermission)
router.put('/:permissionId', authenticateJWT, isSuperAdmin, validateUpdatePermission, updatePermission)
router.patch('/:permissionId', authenticateJWT, isSuperAdmin, validateUpdatePermission, updatePermission)
router.delete('/:permissionId', authenticateJWT, isSuperAdmin, deletePermission)


// Permission management routes
router.get('/:userId/permissions-user', authenticateJWT, isSuperAdmin, getUserPermissions)
router.post('/:userId/add-permission-user', authenticateJWT, isSuperAdmin, validatePermission, auditLogMiddleware('addPermissionToUser'), addPermissionToUser)
router.delete('/:userId/revoke-permission-user', authenticateJWT, isSuperAdmin, validatePermission, auditLogMiddleware('revokePermissionToUser'), revokePermissionFromUser)

router.get('/:roleId/permissions-role', authenticateJWT, isSuperAdmin, getPermissionsOfRole)
router.post('/:roleId/add-permission-role', authenticateJWT, isSuperAdmin, validatePermission, auditLogMiddleware('addPermissionToRole'), addPermissionsToRole)
router.delete('/:roleId/revoke-permission-role', authenticateJWT, isSuperAdmin, validatePermission, auditLogMiddleware('revokePermissionFromRole'), revokePermissionsFromRole)


export default router