// routes/index.js

// Import des différentes routes de l'application
import authRoutes from './authRoutes.js'
import userRoutes from './userRoutes.js'
import adminRoutes from './adminRoutes.js'
import roleRoutes from './roleRoutes.js'
import permissionRoutes from './permissionRoutes.js'
import bookRoutes from './bookRoutes.js'
import loanRoutes from './loanRoutes.js'
import reservationRoutes from './reservationRoutes.js'
import categoryRoutes from './categoryRoutes.js'
import reportRoutes from './reportRoutes.js'
import auditLogRoutes from './auditLogRoutes.js'
import supportTicketRoutes from './supportTicketRoutes.js'
import ticketResponseRoutes from './ticketResponseRoutes.js'
import faqRoutes from './faqRoutes.js'

// Configuration des routes de l'API
// Structure: '/api/[ressource]': moduleRoutes
export default {
    // Routes d'authentification et gestion des utilisateurs
    '/api/auth': authRoutes,            // Authentification
    '/api/users': userRoutes,           // Gestion des utilisateurs
    '/api/admin': adminRoutes,          // Administration

    // Routes de gestion des rôles et permissions
    '/api/roles': roleRoutes,           // Gestion des rôles
    '/api/permissions': permissionRoutes, // Gestion des permissions

    // Routes de gestion de la bibliothèque
    '/api/books': bookRoutes,           // Gestion des livres
    '/api/loans': loanRoutes,           // Gestion des emprunts
    '/api/reservations': reservationRoutes, // Gestion des réservations
    '/api/categories': categoryRoutes,   // Gestion des catégories

    // Routes de monitoring et support
    '/api/report': reportRoutes,        // Rapports
    '/api/audit-log': auditLogRoutes,   // Logs d'audit
    '/api/support-tickets': supportTicketRoutes, // Tickets support
    '/api/ticket-responses': ticketResponseRoutes, // Réponses aux tickets
    '/api/faqs': faqRoutes             // FAQ
}