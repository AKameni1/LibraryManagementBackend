// controllers/faqController.js
import FAQ from '../models/FAQ.js';

// Get all FAQs
export const getAllFaqs = async (req, res) => {
    try {
        const faqs = await FAQ.findAll({
            order: [['CreatedAt', 'DESC']]
        });
        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQs", error: error.message });
    }
};

// Get a single FAQ by ID
export const getFaqById = async (req, res) => {
    try {
        const faq = await FAQ.findByPk(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }
        res.status(200).json(faq);
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQ", error: error.message });
    }
};

// Create a new FAQ
export const createFaq = async (req, res) => {
    try {
        const { Question, Answer } = req.body;
        const faq = await FAQ.create({
            Question,
            Answer,
            CreatedAt: new Date(),
            UpdatedAt: new Date()
        });
        res.status(201).json(faq);
    } catch (error) {
        res.status(500).json({ message: "Error creating FAQ", error: error.message });
    }
};

// Update an FAQ
export const updateFaq = async (req, res) => {
    try {
        const { Question, Answer } = req.body;
        const faq = await FAQ.findByPk(req.params.id);

        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        await faq.update({
            Question: Question || faq.Question,
            Answer: Answer || faq.Answer,
            UpdatedAt: new Date()
        });

        res.status(200).json(faq);
    } catch (error) {
        res.status(500).json({ message: "Error updating FAQ", error: error.message });
    }
};

// Delete an FAQ
export const deleteFaq = async (req, res) => {
    try {
        const faq = await FAQ.findByPk(req.params.id);

        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        await faq.destroy();
        res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting FAQ", error: error.message });
    }
};