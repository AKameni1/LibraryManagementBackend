// routes/faqRoutes.js

import express from 'express';
import { getAllFaqs, getFaqById, createFaq, updateFaq, deleteFaq } from '../controllers/faqController.js';

const router = express.Router();

// Route pour obtenir toutes les FAQs
router.get('/', getAllFaqs);

// Route pour obtenir une FAQ spécifique par son ID
router.get('/:id', getFaqById);

// Route pour créer une nouvelle FAQ
router.post('/', createFaq);

// Route pour mettre à jour une FAQ existante par son ID
router.put('/:id', updateFaq);

// Route pour supprimer une FAQ par son ID
router.delete('/:id', deleteFaq);

export default router;
