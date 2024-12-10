import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import routes from './routes/index.js'
import sequelize from './config/db.js'
import './utils/scheduler.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'PUT', 'PATCH', 'POST', 'HEAD', 'OPTION'],
    })
)
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use(express.urlencoded({ extended: true }))

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
