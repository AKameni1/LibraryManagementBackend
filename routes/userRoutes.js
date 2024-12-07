import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import upload from '../middlewares/upload.js'
import {
    createUser,
    getUserProfileImage,
    updateUser,
} from '../controllers/userController.js'
import { validateCreateUser, validateUpdateUser } from '../utils/validation.js'
import { isCurrentUser } from '../middlewares/authorization.js'

const router = express.Router()

router.post(
    '/register',
    upload.single('profileImage'),
    validateCreateUser,
    createUser
)

router.patch(
    '/me',
    authenticateJWT,
    isCurrentUser,
    upload.single('profileImage'),
    validateUpdateUser,
    updateUser
)

router.get('/:userId/profile-image', authenticateJWT, getUserProfileImage)

export default router
