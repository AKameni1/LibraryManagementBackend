import express from 'express';
import { 
  createTicketResponse, 
  getTicketResponseById, 
  getAllTicketResponses, 
  updateTicketResponse, 
  deleteTicketResponse 
} from './ticketResponse.controller.js';

const router = express.Router();
router.post('/', createTicketResponse); 
router.get('/', getAllTicketResponses); 
router.get('/:id', getTicketResponseById); 
router.put('/:id', updateTicketResponse); 
router.delete('/:id', deleteTicketResponse);  

export default router;
