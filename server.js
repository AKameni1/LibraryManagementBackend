import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import roleRoutes from './routes/roleRoutes.js'
import permissionRoutes from './routes/permissionRoutes.js'
import bookRoutes from './routes/bookRoutes.js'
import loanRoutes from './routes/loanRoutes.js'
import reservationRoutes from './routes/reservationRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import reportRoutes from './routes/reportRoutes.js'
import auditLogRoutes from './routes/auditLogRoutes.js'
import sequelize from './config/db.js'
import './utils/scheduler.js'

dotenv.config()

const app = express()
app.use(express.json())


// Utilisation des routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/roles', roleRoutes)
app.use('/api/permissions', permissionRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/loans', loanRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/audit-logs', auditLogRoutes)

// Connexion à la base de données
sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}).catch((err) => {
    console.error('Unable to connect to the database:', err)
})