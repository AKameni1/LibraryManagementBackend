import { validationResult } from 'express-validator'
import { SupportTicket, User, TicketResponse } from '../models/index.js'
import { Op } from 'sequelize'

// Récupérer tous les tickets (admin) ou les tickets de l'utilisateur connecté
export const getTickets = async (req, res) => {
    try {
        const isAdmin = ['admin', 'superAdmin'].includes(req.user.role)
        const queryOptions = {
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['Username', 'Email']
                }
            ],
            order: [['CreatedAt', 'DESC']]
        }

        // Si ce n'est pas un admin, filtrer seulement les tickets de l'utilisateur
        if (!isAdmin) {
            queryOptions.where = { UserID: req.user.userId }
        }

        const tickets = await SupportTicket.findAll(queryOptions)
        res.status(200).json(tickets)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erreur lors de la récupération des tickets' })
    }
}

// Récupérer un ticket spécifique
export const getTicketById = async (req, res) => {
    const { ticketId } = req.params

    try {
        const ticket = await SupportTicket.findByPk(ticketId, {
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['Username', 'Email']
                },
                {
                    model: TicketResponse,
                    as: 'Responses',
                    include: [{
                        model: User,
                        as: 'User',
                        attributes: ['Username']
                    }]
                }
            ]
        })

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket non trouvé' })
        }

        // Vérifier si l'utilisateur a le droit de voir ce ticket
        const isAdmin = ['admin', 'superAdmin'].includes(req.user.role)
        if (!isAdmin && ticket.UserID !== req.user.userId) {
            return res.status(403).json({ message: 'Accès non autorisé à ce ticket' })
        }

        res.status(200).json(ticket)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erreur lors de la récupération du ticket' })
    }
}

// Créer un nouveau ticket
export const createTicket = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { subject, description } = req.body

    try {
        const newTicket = await SupportTicket.create({
            UserID: req.user.userId,
            Subject: subject,
            Description: description,
            Status: 'Open'
        })

        res.status(201).json({
            message: 'Ticket créé avec succès',
            ticket: newTicket
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erreur lors de la création du ticket' })
    }
}

// Mettre à jour le statut d'un ticket
export const updateTicketStatus = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { ticketId } = req.params
    const { status } = req.body

    try {
        const ticket = await SupportTicket.findByPk(ticketId)

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket non trouvé' })
        }

        // Seul un admin peut changer le statut en "In Progress"
        const isAdmin = ['admin', 'superAdmin'].includes(req.user.role)
        if (status === 'In Progress' && !isAdmin) {
            return res.status(403).json({ message: 'Seul un administrateur peut mettre un ticket en cours' })
        }

        // Pour fermer un ticket, l'utilisateur doit être soit l'admin soit le créateur du ticket
        if (status === 'Closed' && !isAdmin && ticket.UserID !== req.user.userId) {
            return res.status(403).json({ message: 'Vous n\'avez pas les droits pour fermer ce ticket' })
        }

        const updatedTicket = await ticket.update({ Status: status })

        res.status(200).json({
            message: 'Statut du ticket mis à jour avec succès',
            ticket: updatedTicket
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erreur lors de la mise à jour du statut du ticket' })
    }
}

// Rechercher des tickets
export const searchTickets = async (req, res) => {
    const { query, status } = req.query

    try {
        const isAdmin = ['admin', 'superAdmin'].includes(req.user.role)
        const whereClause = {}

        // Filtre par statut si spécifié
        if (status) {
            whereClause.Status = status
        }

        // Filtre par recherche si spécifié
        if (query) {
            whereClause[Op.or] = [
                { Subject: { [Op.like]: `%${query}%` } },
                { Description: { [Op.like]: `%${query}%` } }
            ]
        }

        // Si non admin, limiter aux tickets de l'utilisateur
        if (!isAdmin) {
            whereClause.UserID = req.user.userId
        }

        const tickets = await SupportTicket.findAll({
            where: whereClause,
            include: [{
                model: User,
                as: 'User',
                attributes: ['Username', 'Email']
            }],
            order: [['CreatedAt', 'DESC']]
        })

        res.status(200).json(tickets)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erreur lors de la recherche des tickets' })
    }
}