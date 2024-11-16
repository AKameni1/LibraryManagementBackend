import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import Role from './Role.js'
import Permission from './Permission.js'

const RolePermission = sequelize.define('RolePermission', {
    RoleID: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'RoleID'
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
    tableName: 'RolePermission',
    timestamps: false
})


export default RolePermission