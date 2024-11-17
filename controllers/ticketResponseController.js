import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import SupportTicket from '../models/SupportTicket.js';  // Importation du modèle SupportTicket
import TicketResponseModel from '../models/TicketResponse.js';  // Importation du modèle TicketResponse

// Si TicketResponse a déjà été défini dans le modèle ticketResponse.model.js, pas besoin de le redéfinir ici.
// Vous pouvez l'utiliser directement.

const TicketResponse = TicketResponseModel(sequelize, DataTypes); // Appel à la fonction exportée pour associer sequelize

// Association avec la table SupportTicket
TicketResponse.belongsTo(SupportTicket, {
  foreignKey: 'supportTicketId',
  onDelete: 'CASCADE', // Si un ticket de support est supprimé, les réponses sont aussi supprimées
});

// Exportation du modèle TicketResponse
export default TicketResponse;
