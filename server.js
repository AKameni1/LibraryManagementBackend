import express from 'express'
import dotenv from 'dotenv'
import routes from './routes/index.js'
import sequelize from './config/db.js'
import './utils/scheduler.js'

dotenv.config()

const app = express()
app.use(express.json())


// Utilisation des routes
Object.entries(routes).forEach(([path, route]) => {
    app.use(path, route)
})

// Connexion à la base de données
sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}).catch((err) => {
    console.error('Unable to connect to the database:', err)
})