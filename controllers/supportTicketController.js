const SupportTicket = require('../model/SupportTicket');

// Créer un ticket
exports.createTicket = async (req, res) => {
  try {
    const newTicket = new SupportTicket(req.body);
    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du ticket', error });
  }
};

// Obtenir tous les tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tickets', error });
  }
};

// Obtenir un ticket par ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé' });
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du ticket', error });
  }
};

// Mettre à jour un ticket
exports.updateTicket = async (req, res) => {
  try {
    const updatedTicket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTicket) return res.status(404).json({ message: 'Ticket non trouvé' });
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du ticket', error });
  }
};

// Supprimer un ticket
exports.deleteTicket = async (req, res) => {
  try {
    const deletedTicket = await SupportTicket.findByIdAndDelete(req.params.id);
    if (!deletedTicket) return res.status(404).json({ message: 'Ticket non trouvé' });
    res.status(200).json({ message: 'Ticket supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du ticket', error });
  }
};
