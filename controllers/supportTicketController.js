import SupportTicket from './supportTicket.model.js'; 

export const createSupportTicket = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const newTicket = new SupportTicket({ title, description, status });
    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du ticket' });
  }
};

export const getAllSupportTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des tickets' });
  }
};

export const getSupportTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket introuvable' });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du ticket' });
  }
};

export const updateSupportTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true, runValidators: true }
    );
    if (!updatedTicket) {
      return res.status(404).json({ error: 'Ticket introuvable' });
    }
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du ticket' });
  }
};

export const deleteSupportTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await SupportTicket.findByIdAndDelete(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket introuvable' });
    }
    res.status(200).json({ message: 'Ticket supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du ticket' });
  }
};
