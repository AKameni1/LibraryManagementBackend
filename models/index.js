// models/index.js
import User from './User.js'
import Role from './Role.js'
import Book from './Book.js'
import Loan from './Loan.js'
import Reservation from './Reservation.js'
import Permission from './Permission.js'
import UserPermission from './UserPermission.js'
import RolePermission from './RolePermission.js'
import Category from './Category.js'
import Report from './Report.js'
import ReportParameter from './ReportParameter.js'
import AuditLog from './AuditLog.js'
import SupportTicket from './SupportTicket.js'
import TicketResponse from './TicketResponse.js'
import FAQ from './FAQ.js'

// Existing Relations
// User-Role Relations
User.belongsTo(Role, { foreignKey: 'RoleId', as: 'Role' })
Role.hasMany(User, { foreignKey: 'RoleId' })

// User-Permission Relations
User.belongsToMany(Permission, { through: UserPermission, foreignKey: 'UserID', as: 'Permissions' })
Permission.belongsToMany(User, { through: UserPermission, foreignKey: 'PermissionID' })

// Role-Permission Relations
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'RoleID' })
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'PermissionID' })

// RolePermission Relations
RolePermission.belongsTo(Role, { foreignKey: 'RoleID' })
RolePermission.belongsTo(Permission, { foreignKey: 'PermissionID' })

// UserPermission Relations
UserPermission.belongsTo(User, { foreignKey: 'UserID' })
UserPermission.belongsTo(Permission, { foreignKey: 'PermissionID' })

// Loan Relations
Loan.belongsTo(User, { foreignKey: 'UserID', onDelete: 'SET NULL' })
Loan.belongsTo(Book, { foreignKey: 'BookID', onDelete: 'SET NULL' })
User.hasMany(Loan, { foreignKey: 'UserID' })
Book.hasMany(Loan, { foreignKey: 'BookID' })

// Reservation Relations
User.hasMany(Reservation, { foreignKey: 'UserID' })
Reservation.belongsTo(User, { foreignKey: 'UserID', as: 'User', onDelete: 'CASCADE' })
Book.hasMany(Reservation, { foreignKey: 'BookID' })
Reservation.belongsTo(Book, { foreignKey: 'BookID', onDelete: 'CASCADE' })

// Book-Category Relations
Book.belongsTo(Category, { foreignKey: 'CategoryID', onDelete: 'CASCADE' })
Category.hasMany(Book, { foreignKey: 'CategoryID', onDelete: 'CASCADE' })

// Report Relations
Report.hasMany(ReportParameter, { foreignKey: 'ReportID', onDelete: 'CASCADE' })
ReportParameter.belongsTo(Report, { foreignKey: 'ReportID' })
AuditLog.belongsTo(User, { foreignKey: 'UserID' })

// New Support Ticket Relations
User.hasMany(SupportTicket, { foreignKey: 'UserID' })
SupportTicket.belongsTo(User, { foreignKey: 'UserID', onDelete: 'CASCADE' })

User.hasMany(TicketResponse, { foreignKey: 'UserID' })
TicketResponse.belongsTo(User, { foreignKey: 'UserID', onDelete: 'CASCADE' })

SupportTicket.hasMany(TicketResponse, { foreignKey: 'TicketID' })
TicketResponse.belongsTo(SupportTicket, { foreignKey: 'TicketID', onDelete: 'CASCADE' })

export {
    User,
    Role,
    Book,
    Loan,
    Category,
    Reservation,
    Permission,
    UserPermission,
    RolePermission,
    Report,
    ReportParameter,
    AuditLog,
    SupportTicket,
    TicketResponse,
    FAQ
}