const TicketResponse = require('../model/TicketResponse');

// Créer une réponse pour un ticket
exports.createResponse = async (req, res) => {
  try {
    const response = new TicketResponse(req.body);
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la réponse', error });
  }
};

// Obtenir les réponses d’un ticket spécifique
exports.getResponsesByTicket = async (req, res) => {
  try {
    const responses = await TicketResponse.find({ ticketId: req.params.ticketId });
    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des réponses', error });
  }
};
