import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import User from './User.js'

const AuditLog = sequelize.define('AuditLog', {
    AuditID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserID: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'UserID'
        },
        allowNull: true
    },
    Entity: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    Action: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    Details: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'AuditLog',
    timestamps: false
})

export default AuditLog