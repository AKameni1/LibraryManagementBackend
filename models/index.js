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
import FAQ from './FAQ.js'
import SupportTicket from './SupportTicket.js'
import TicketResponse from './TicketResponse.js'

// Définition des relations entre nos models

// Relation entre User et Role
User.belongsTo(Role, { foreignKey: 'RoleId', as: 'Role' })
Role.hasMany(User, { foreignKey: 'RoleId' })


// Relation entre User et Permission via UserPermission
User.belongsToMany(Permission, { through: UserPermission, foreignKey: 'UserID', as: 'Permissions' })
Permission.belongsToMany(User, { through: UserPermission, foreignKey: 'PermissionID' })

// Relation entre Role et Permission via RolePermission
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'RoleID' })
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'PermissionID' })


// Relation RolePermission-Role et RolePermission-Permission
RolePermission.belongsTo(Role, { foreignKey: 'RoleID' })
RolePermission.belongsTo(Permission, { foreignKey: 'PermissionID' })

// Relation UserPermission-User et UserPermission-Permission
UserPermission.belongsTo(User, { foreignKey: 'UserID' })
UserPermission.belongsTo(Permission, { foreignKey: 'PermissionID' })


// Relations Loan - User et Loan - Book
Loan.belongsTo(User, { foreignKey: 'UserID', onDelete: 'SET NULL' })
Loan.belongsTo(Book, { foreignKey: 'BookID', onDelete: 'SET NULL' })

User.hasMany(Loan, { foreignKey: 'UserID' })
Book.hasMany(Loan, { foreignKey: 'BookID' })


// Relation entre User et Reservation
User.hasMany(Reservation, { foreignKey: 'UserID' })
Reservation.belongsTo(User, { foreignKey: 'UserID', as: 'User', onDelete: 'CASCADE' })

// Relation entre Book et Reservation
Book.hasMany(Reservation, { foreignKey: 'BookID' })
Reservation.belongsTo(Book, { foreignKey: 'BookID', onDelete: 'CASCADE' })

// Relation entre Book et Category
Book.belongsTo(Category, { foreignKey: 'CategoryID', onDelete: 'CASCADE' })
Category.hasMany(Book, { foreignKey: 'CategoryID', onDelete: 'CASCADE' })

Report.hasMany(ReportParameter, { foreignKey: 'ReportID', onDelete: 'CASCADE' })
ReportParameter.belongsTo(Report, { foreignKey: 'ReportID' })
AuditLog.belongsTo(User, { foreignKey: 'UserID' })

export { User, Role, Book, Loan, Category, Reservation, Permission, UserPermission, RolePermission, Report, ReportParameter, AuditLog, FAQ, SupportTicket, TicketResponse}