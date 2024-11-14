import express from 'express'
import authenticateJWT from '../middlewares/authMiddleware.js'
import { getUserInfo, updateUser } from '../controllers/userController.js'
import { validateCreateUser, validateUpdateUser } from '../utils/validation.js'
import { isCurrentUser } from '../middlewares/authorization.js'
import { createUser } from '../controllers/adminController.js'


const router = express.Router()

// Profile route
router.get('/profile', authenticateJWT, getUserInfo)

router.post('/create', validateCreateUser, createUser)

router.put('/:userId', authenticateJWT, isCurrentUser, validateUpdateUser, updateUser)
router.patch('/:userId', authenticateJWT, isCurrentUser, validateUpdateUser, updateUser)


export default router