import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Assurez-vous que ce chemin est correct.

const TicketResponse = sequelize.define('TicketResponse', {
  supportTicketId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'SupportTicket', // Référence à la table 'SupportTicket'
      key: 'id',
    },
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  responder: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'ticket_responses',
});

// Association avec SupportTicket (si nécessaire)
TicketResponse.belongsTo(SupportTicket, { foreignKey: 'supportTicketId' });

export default TicketResponse;
