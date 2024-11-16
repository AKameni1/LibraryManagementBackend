import express from 'express';
import { 
  createFAQ, 
  getAllFAQs, 
  getFAQById, 
  updateFAQ, 
  deleteFAQ 
} from './faq.controller.js';

const router = express.Router();
router.post('/', createFAQ); 
router.get('/', getAllFAQs); 
router.get('/:id', getFAQById); 
router.put('/:id', updateFAQ); 
router.delete('/:id', deleteFAQ); 

export default router;
