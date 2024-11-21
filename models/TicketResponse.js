import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import SupportTicket from './SupportTicket.js';

const TicketResponse = sequelize.define('TicketResponse', {
    ResponseID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    TicketID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SupportTicket,
            key: 'TicketID'
        }
    },
    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'UserID'
        }
    },
    ResponseText: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    ResponseDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'ticketresponse',
    timestamps: false
});

// Define associations
TicketResponse.belongsTo(SupportTicket, {
    foreignKey: 'TicketID',
    as: 'Ticket'
});

TicketResponse.belongsTo(User, {
    foreignKey: 'UserID',
    as: 'User'
});

export default TicketResponse;