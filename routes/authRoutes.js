import express from 'express'
import { loginUser, refreshAccessToken } from '../controllers/authController.js'
import { validateAuth } from '../utils/validation.js'


const router = express.Router()


router.post('/login', validateAuth, loginUser)
router.post('/refresh-token', refreshAccessToken)

export default router