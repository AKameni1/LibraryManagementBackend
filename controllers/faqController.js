import { validationResult } from 'express-validator'
import { FAQ } from '../models/index.js'

// Récupérer toutes les FAQs
export const getAllFAQs = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1) // Minimum : 1
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)) // Limité entre 1 et 100
    const offset = (page - 1) * limit

    try {
        const { rows: faqs, count: total } = await FAQ.findAndCountAll({
            order: [['CreatedAt', 'DESC']],
            limit: limit,
            offset: offset,
        })

        res.status(200).json({
            total: total, // Nombre total de FAQs
            page: parseInt(page), // Page actuelle
            limit: parseInt(limit), // Limite par page
            totalPages: Math.ceil(total / limit), // Nombre total de pages
            faqs: faqs, // Liste des FAQs pour cette page
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Erreur lors de la récupération des FAQs',
        })
    }
}

// Récupérer une FAQ par son ID
export const getFAQById = async (req, res) => {
    const { faqId } = req.params

    try {
        const faq = await FAQ.findByPk(faqId)

        if (!faq) {
            return res.status(404).json({ message: 'FAQ non trouvée' })
        }

        res.status(200).json(faq)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Erreur lors de la récupération de la FAQ',
        })
    }
}

// Créer une nouvelle FAQ
export const createFAQ = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { question, answer } = req.body

    try {
        const newFAQ = await FAQ.create({
            Question: question,
            Answer: answer,
        })

        res.status(201).json({
            message: 'FAQ créée avec succès',
            faq: newFAQ,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Erreur lors de la création de la FAQ',
        })
    }
}

// Mettre à jour une FAQ
export const updateFAQ = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { faqId } = req.params
    const { question, answer } = req.body

    try {
        const faq = await FAQ.findByPk(faqId)

        if (!faq) {
            return res.status(404).json({ message: 'FAQ non trouvée' })
        }

        const updatedFAQ = await faq.update({
            Question: question || faq.Question,
            Answer: answer || faq.Answer,
        })

        res.status(200).json({
            message: 'FAQ mise à jour avec succès',
            faq: updatedFAQ,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de la FAQ',
        })
    }
}

// Supprimer une FAQ
export const deleteFAQ = async (req, res) => {
    const { faqId } = req.params

    try {
        const faq = await FAQ.findByPk(faqId)

        if (!faq) {
            return res.status(404).json({ message: 'FAQ non trouvée' })
        }

        await faq.destroy()
        res.status(200).json({ message: 'FAQ supprimée avec succès' })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Erreur lors de la suppression de la FAQ',
        })
    }
}
