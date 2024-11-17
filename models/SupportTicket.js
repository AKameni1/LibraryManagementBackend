// models/SupportTicket.js

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const SupportTicket = sequelize.define('SupportTicket', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'open',
  },
}, {
  timestamps: true,
  tableName: 'support_tickets',
});
export default SupportTicket;
