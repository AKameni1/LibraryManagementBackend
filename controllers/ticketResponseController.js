import { validationResult } from 'express-validator'
import { TicketResponse, SupportTicket, User } from '../models/index.js'

// Récupérer toutes les réponses d'un ticket
export const getTicketResponses = async (req, res) => {
    const { ticketId } = req.params

    try {
        // Vérifier d'abord si le ticket existe
        const ticket = await SupportTicket.findByPk(ticketId)
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket non trouvé' })
        }

        // Vérifier si l'utilisateur a le droit de voir les réponses
        const isAdmin = ['admin', 'superAdmin'].includes(req.user.role)
        if (!isAdmin && ticket.UserID !== req.user.userId) {
            return res.status(403).json({ message: 'Accès non autorisé aux réponses de ce ticket' })
        }

        const responses = await TicketResponse.findAll({
            where: { TicketID: ticketId },
            include: [{
                model: User,
                as: 'User',
                attributes: ['Username', 'Email']
            }],
            order: [['ResponseDate', 'ASC']]
        })

        res.status(200).json(responses)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erreur lors de la récupération des réponses' })
    }
}

// Ajouter une réponse à un ticket
export const addTicketResponse = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { ticketId } = req.params
    const { responseText } = req.body

    try {
        // Vérifier si le ticket existe et n'est pas fermé
        const ticket = await SupportTicket.findByPk(ticketId)
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket non trouvé' })
        }

        if (ticket.Status === 'Closed') {
            return res.status(400).json({ message: 'Impossible d\'ajouter une réponse à un ticket fermé' })
        }

        // Vérifier si l'utilisateur a le droit de répondre
        const isAdmin = ['admin', 'superAdmin'].includes(req.user.role)
        if (!isAdmin && ticket.UserID !== req.user.userId) {
            return res.status(403).json({ message: 'Vous n\'avez pas le droit de répondre à ce ticket' })
        }

        const newResponse = await TicketResponse.create({
            TicketID: ticketId,
            UserID: req.user.userId,
            ResponseText: responseText
        })

        // Si l'utilisateur n'est pas admin, mettre à jour le statut du ticket en "In Progress"
        if (!isAdmin && ticket.Status === 'Open') {
            await ticket.update({ Status: 'In Progress' })
        }

        const responseWithUser = await TicketResponse.findByPk(newResponse.ResponseID, {
            include: [{
                model: User,
                as: 'User',
                attributes: ['Username', 'Email']
            }]
        })

        res.status(201).json({
            message: 'Réponse ajoutée avec succès',
            response: responseWithUser
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erreur lors de l\'ajout de la réponse' })
    }
}

// Mettre à jour une réponse
export const updateTicketResponse = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { responseId } = req.params
    const { responseText } = req.body

    try {
        const response = await TicketResponse.findByPk(responseId, {
            include: [{
                model: SupportTicket,
                as: 'Ticket'
            }]
        })

        if (!response) {
            return res.status(404).json({ message: 'Réponse non trouvée' })
        }

        // Vérifier si le ticket est fermé
        if (response.Ticket.Status === 'Closed') {
            return res.status(400).json({ message: 'Impossible de modifier une réponse d\'un ticket fermé' })
        }

        // Seul l'auteur de la réponse ou un admin peut la modifier
        const isAdmin = ['admin', 'superAdmin'].includes(req.user.role)
        if (!isAdmin && response.UserID !== req.user.userId) {
            return res.status(403).json({ message: 'Vous n\'avez pas le droit de modifier cette réponse' })
        }

        const updatedResponse = await response.update({
            ResponseText: responseText
        })

        res.status(200).json({
            message: 'Réponse mise à jour avec succès',
            response: updatedResponse
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la réponse' })
    }
}

// Supprimer une réponse
export const deleteTicketResponse = async (req, res) => {
    const { responseId } = req.params

    try {
        const response = await TicketResponse.findByPk(responseId, {
            include: [{
                model: SupportTicket,
                as: 'Ticket'
            }]
        })

        if (!response) {
            return res.status(404).json({ message: 'Réponse non trouvée' })
        }

        // Vérifier si le ticket est fermé
        if (response.Ticket.Status === 'Closed') {
            return res.status(400).json({ message: 'Impossible de supprimer une réponse d\'un ticket fermé' })
        }

        // Seul l'auteur de la réponse ou un admin peut la supprimer
        const isAdmin = ['admin', 'superAdmin'].includes(req.user.role)
        if (!isAdmin && response.UserID !== req.user.userId) {
            return res.status(403).json({ message: 'Vous n\'avez pas le droit de supprimer cette réponse' })
        }

        await response.destroy()

        res.status(200).json({ message: 'Réponse supprimée avec succès' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erreur lors de la suppression de la réponse' })
    }
}