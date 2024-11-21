import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const SupportTicket = sequelize.define('SupportTicket', {
    TicketID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'UserID'
        }
    },
    Subject: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Status: {
        type: DataTypes.ENUM('Open', 'In Progress', 'Closed'),
        defaultValue: 'Open'
    },
    CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'supportticket',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
});

// Define associations
SupportTicket.belongsTo(User, {
    foreignKey: 'UserID',
    as: 'User'
});

export default SupportTicket;