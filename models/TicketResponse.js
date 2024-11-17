// models/TicketResponse.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const TicketResponse = sequelize.define('ticketresponse', {
  ResponseID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  TicketID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'supportticket',
      key: 'TicketID'
    }
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'user',
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

export default TicketResponse;