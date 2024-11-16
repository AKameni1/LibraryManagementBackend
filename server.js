import express from 'express'
import dotenv from 'dotenv'
import routes from './routes/index.js'
import sequelize from './config/db.js'
<<<<<<< HEAD
import supportTicketRoutes from './routes/supportTicketRoutes.js';
import ticketResponseRoutes from './routes/ticketResponseRoutes.js';
import faqRoutes from './routes/faqRoutes.js';

=======
import './utils/scheduler.js'
>>>>>>> b8955bc5ed868d9b5796c946743e37a53799fbd8

dotenv.config()

const app = express()
app.use(express.json())


// Utilisation des routes
<<<<<<< HEAD
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/permissions', permissionRoutes)
app.use('/api/support-tickets', supportTicketRoutes);
app.use('/api/ticket-responses', ticketResponseRoutes);
app.use('/api/faqs', faqRoutes);


=======
Object.entries(routes).forEach(([path, route]) => {
    app.use(path, route)
})
>>>>>>> b8955bc5ed868d9b5796c946743e37a53799fbd8

// Connexion à la base de données
sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}).catch((err) => {
    console.error('Unable to connect to the database:', err)
})