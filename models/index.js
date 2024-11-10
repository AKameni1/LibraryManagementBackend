import User from './User.js'
import Role from './Role.js'
import Permission from './Permission.js'
import UserPermission from './UserPermission.js'
import RolePermission from './RolePermission.js'


// Définition des relations entre nos models


// Relation entre User et Permission via UserPermission
User.belongsToMany(Permission, { through: UserPermission, foreignKey: 'UserID' })
Permission.belongsToMany(User, { through: UserPermission, foreignKey: 'PermissionID' })

// Relation entre Role et Permission via RolePermission
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: 'RoleID' })
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: 'PermissionID' })

export { User, Role, Permission, UserPermission, RolePermission }