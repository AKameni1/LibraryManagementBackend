// controllers/supportTicketController.js
import SupportTicket from '../models/SupportTicket.js';
import { Op } from 'sequelize';

// Get all support tickets
export const getAllSupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.findAll({
      where: { UserID: req.user.UserID }
    });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching support tickets", error: error.message });
  }
};

// Create a new support ticket
export const createSupportTicket = async (req, res) => {
  try {
    const { Subject, Description } = req.body;
    const ticket = await SupportTicket.create({
      UserID: req.user.UserID,
      Subject,
      Description,
      Status: 'Open',
      CreatedAt: new Date(),
      UpdatedAt: new Date()
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error creating support ticket", error: error.message });
  }
};

// Update a support ticket
export const updateSupportTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { Subject, Description, Status } = req.body;

    const ticket = await SupportTicket.findOne({
      where: {
        TicketID: ticketId,
        UserID: req.user.UserID
      }
    });

    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    await ticket.update({
      Subject: Subject || ticket.Subject,
      Description: Description || ticket.Description,
      Status: Status || ticket.Status,
      UpdatedAt: new Date()
    });

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Error updating support ticket", error: error.message });
  }
};

// Delete a support ticket
export const deleteSupportTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await SupportTicket.findOne({
      where: {
        TicketID: ticketId,
        UserID: req.user.UserID
      }
    });

    if (!ticket) {
      return res.status(404).json({ message: "Support ticket not found" });
    }

    await ticket.destroy();
    res.status(200).json({ message: "Support ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting support ticket", error: error.message });
  }
};