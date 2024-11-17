// models/SupportTicket.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const SupportTicket = sequelize.define('supportticket', {
  TicketID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'user',
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
  timestamps: false
});

export default SupportTicket;