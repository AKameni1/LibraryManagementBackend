import express from 'express'
import dotenv from 'dotenv'
import routes from './routes/index.js'
import sequelize from './config/db.js'
import './utils/scheduler.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-type', 'Authorization'],
    })
)

// Utilisation des routes
Object.entries(routes).forEach(([path, route]) => {
    app.use(path, route)
})

// Connexion à la base de données
sequelize
    .sync()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err)
    })
