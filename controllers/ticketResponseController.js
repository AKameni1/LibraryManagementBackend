// controllers/ticketResponseController.js
import TicketResponse from '../models/TicketResponse.js';
import SupportTicket from '../models/SupportTicket.js';

// Get all responses for a ticket
export const getTicketResponses = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await SupportTicket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    const responses = await TicketResponse.findAll({
      where: { TicketID: ticketId },
      order: [['ResponseDate', 'ASC']]
    });

    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching responses", error: error.message });
  }
};

// Create a ticket response
export const createTicketResponse = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { ResponseText } = req.body;

    const ticket = await SupportTicket.findByPk(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    const response = await TicketResponse.create({
      TicketID: ticketId,
      UserID: req.user.UserID,
      ResponseText,
      ResponseDate: new Date()
    });

    // Update ticket status and timestamps
    if (ticket.Status === 'Open') {
      await ticket.update({
        Status: 'In Progress',
        UpdatedAt: new Date()
      });
    }

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error creating response", error: error.message });
  }
};