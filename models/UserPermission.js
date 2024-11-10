import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import User from './User.js'
import Permission from './Permission.js'

const UserPermission = sequelize.define('UserPermission', {
    UserID: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'UserID'
        },
        allowNull: false
    },

    PermissionID: {
        type: DataTypes.INTEGER,
        references: {
            model: Permission,
            key: 'PermissionID'
        },
        allowNull: false
    }
}, {
    tableName: 'UserPermission',
    timestamps: false
})

UserPermission.belongsTo(User, { foreignKey: 'UserID' })
UserPermission.belongsTo(Permission, { foreignKey: 'PermissionID' })

export default UserPermission