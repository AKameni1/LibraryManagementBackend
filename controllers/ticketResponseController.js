import TicketResponse from './ticketResponse.model.js';

export const createTicketResponse = async (req, res) => {
  try {
    const { ticketId, response } = req.body;
    const newResponse = new TicketResponse({ ticketId, response });
    await newResponse.save();
    res.status(201).json(newResponse);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création de la réponse' });
  }
};

export const getTicketResponseById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await TicketResponse.findById(id);
    if (!response) {
      return res.status(404).json({ error: 'Réponse introuvable' });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération de la réponse' });
  }
};

export const getAllTicketResponses = async (req, res) => {
  try {
    const responses = await TicketResponse.find();
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des réponses' });
  }
};

export const updateTicketResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { ticketId, response } = req.body;
    const updatedResponse = await TicketResponse.findByIdAndUpdate(
      id,
      { ticketId, response },
      { new: true, runValidators: true }
    );
    if (!updatedResponse) {
      return res.status(404).json({ error: 'Réponse introuvable' });
    }
    res.status(200).json(updatedResponse);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la réponse' });
  }
};

export const deleteTicketResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await TicketResponse.findByIdAndDelete(id);
    if (!response) {
      return res.status(404).json({ error: 'Réponse introuvable' });
    }
    res.status(200).json({ message: 'Réponse supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression de la réponse' });
  }
};
