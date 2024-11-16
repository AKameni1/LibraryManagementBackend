import express from 'express';
import { 
  createSupportTicket, 
  getAllSupportTickets, 
  getSupportTicketById, 
  updateSupportTicket, 
  deleteSupportTicket 
} from './supportTicket.controller.js';

const router = express.Router();
router.post('/', createSupportTicket); 
router.get('/', getAllSupportTickets);  
router.get('/:id', getSupportTicketById);
router.put('/:id', updateSupportTicket);  
router.delete('/:id', deleteSupportTicket);  

export default router;
