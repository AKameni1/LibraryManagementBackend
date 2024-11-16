import mongoose from 'mongoose';

const ticketResponseSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'SupportTicket', required: true },
  response: { type: String, required: true }
});

const TicketResponse = mongoose.model('TicketResponse', ticketResponseSchema);
export default TicketResponse;
