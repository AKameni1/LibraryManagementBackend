import TicketResponse from '../models/TicketResponse.js'; 
 

// Exemple de création d'une réponse au ticket
const createResponse = async (req, res) => {
  try {
    const { supportTicketId, response, responder } = req.body;
    const ticketResponse = await TicketResponse.create({ supportTicketId, response, responder });
    res.status(201).json(ticketResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating response', error });
  }
};

// Exemple de récupération de toutes les réponses pour un ticket
const getTicketResponses = async (req, res) => {
  try {
    const { supportTicketId } = req.params;
    const responses = await TicketResponse.findAll({
      where: { supportTicketId },
    });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching responses', error });
  }
};

export { createResponse, getTicketResponses };
