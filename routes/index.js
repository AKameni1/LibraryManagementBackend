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

export default {
    '/api/auth': authRoutes,
    '/api/users': userRoutes,
    '/api/admin': adminRoutes,
    '/api/roles': roleRoutes,
    '/api/permissions': permissionRoutes,
    '/api/books': bookRoutes,
    '/api/loans': loanRoutes,
    '/api/reservations': reservationRoutes,
    '/api/categories': categoryRoutes,
    '/api/report': reportRoutes,
    '/api/audit-log': auditLogRoutes
}