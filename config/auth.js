import dotenv from 'dotenv'

dotenv.config()

export default {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH: process.env.JWT_REFRESH_SECRET,
    JWT_EXPIRATION: '15m', 
    JWT_REFRESH_EXPIRATION: '7d'
}