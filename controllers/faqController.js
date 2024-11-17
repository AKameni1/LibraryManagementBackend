import FAQ from '../models/FAQ.js';

// Récupérer toutes les FAQs
export const getAllFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.findAll({ where: { userId: req.user.id } }); // Filtrer par utilisateur connecté
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.', error });
    }
};

// Créer une FAQ
export const createFAQ = async (req, res) => {
    try {
        const { title, content } = req.body;

        const newFAQ = await FAQ.create({
            userId: req.user.id, // Associe l'utilisateur connecté
            title,
            content,
        });

        res.status(201).json(newFAQ);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur.', error });
    }
};
