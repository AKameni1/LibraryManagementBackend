const mongoose = require('mongoose');

const ticketResponseSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'SupportTicket', required: true },
  responseText: { type: String, required: true },
  respondedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TicketResponse', ticketResponseSchema);
