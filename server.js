import express from 'express'
import dotenv from 'dotenv'
import routes from './routes/index.js'
import sequelize from './config/db.js'
import './utils/scheduler.js'

dotenv.config()

const app = express()
app.use(express.json())

// Enregistre toutes les routes depuis routes/index.js
Object.entries(routes).forEach(([path, route]) => {
    app.use(path, route)
})

// Démarre le serveur et synchronise la base de données
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('La connexion à la base de données a été établie avec succès.');

        await sequelize.sync();
        console.log('Tous les modèles ont été synchronisés avec succès.');

        app.listen(process.env.PORT, () => {
            console.log(`Le serveur fonctionne sur le port ${process.env.PORT}`)
        });
    } catch (err) {
        console.error('Impossible de se connecter à la base de données:', err);
        process.exit(1);
    }
};

startServer();