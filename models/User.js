import { DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'
import sequelize from '../config/db.js'
import Role from './Role.js'
import Permission from './Permission.js'

const User = sequelize.define('User', {
    UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    Username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    Email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },

    Password: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    CreationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },

    RoleID: {
        type: DataTypes.INTEGER,
        references: {
            model: Role,
            key: 'RoleID',
        },
        allowNull: false,
    }
}, {
    tableName: 'User',
    timestamps: false, 
    hooks: {
        beforeCreate: (user) => {
            user.Password = bcrypt.hashSync(user.Password)
        }
    }
})

User.belongsTo(Role, { foreignKey: 'RoleId', as: 'Role' })
Role.hasMany(User, { foreignKey: 'RoleId' })

User.belongsToMany(Permission, { through: 'UserPermission', foreignKey: 'UserID', as: 'Permissions' })

export default User