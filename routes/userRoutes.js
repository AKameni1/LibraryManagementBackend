import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import upload from '../middlewares/upload.js'
import {
    getUserInfo,
    updateUser,
    createUser,
} from '../controllers/userController.js'
import { validateCreateUser, validateUpdateUser } from '../utils/validation.js'
import { isCurrentUser } from '../middlewares/authorization.js'

const router = express.Router()

// Profile route
router.get('/profile', authenticateJWT, getUserInfo)

router.post(
    '/create',
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

export default router
