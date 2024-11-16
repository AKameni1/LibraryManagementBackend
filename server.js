import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import roleRoutes from './routes/roleRoutes.js'
import permissionRoutes from './routes/permissionRoutes.js'
import sequelize from './config/db.js'
import supportTicketRoutes from './routes/supportTicketRoutes.js';
import ticketResponseRoutes from './routes/ticketResponseRoutes.js';
import faqRoutes from './routes/faqRoutes.js';


dotenv.config()

const app = express()
app.use(express.json())


// Utilisation des routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/permissions', permissionRoutes)
app.use('/api/support-tickets', supportTicketRoutes);
app.use('/api/ticket-responses', ticketResponseRoutes);
app.use('/api/faqs', faqRoutes);



// Connexion à la base de données
sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}).catch((err) => {
    console.error('Unable to connect to the database:', err)
})