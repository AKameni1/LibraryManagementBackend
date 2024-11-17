// routes/faqRoutes.js
import express from 'express';
import authenticateJWT from '../middlewares/authMiddleware.js';
import { getAllFaqs, getFaqById, createFaq, updateFaq, deleteFaq } from '../controllers/faqController.js';

const router = express.Router();

// Routes publiques - accessibles sans authentification
// GET: Récupère toutes les FAQs
router.get('/', getAllFaqs);

// GET: Récupère une FAQ spécifique par son ID
router.get('/:id', getFaqById);

// Routes protégées - réservées aux administrateurs
// POST: Crée une nouvelle FAQ
router.post('/', authenticateJWT, createFaq);

// PUT: Met à jour une FAQ existante
router.put('/:id', authenticateJWT, updateFaq);

// DELETE: Supprime une FAQ
router.delete('/:id', authenticateJWT, deleteFaq);

export default router;