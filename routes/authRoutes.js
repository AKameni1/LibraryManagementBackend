import express from 'express'
import { loginUser } from '../controllers/authController.js'
import { validateAuth } from '../utils/validation.js'


const router = express.Router()


router.post('/login', validateAuth, loginUser)

export default router