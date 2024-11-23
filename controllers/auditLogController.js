import { AuditLog, User } from '../models/index.js'
import { handleError } from '../utils/handleError.js'

export const logAction = async (userId, entity, action, details) => {
    console.log('logAction called with:', { userId, entity, action, details })

    if (!userId || typeof userId !== 'number') {
        console.warn(
            'userId not provided or invalid. Logging system action with default ID.'
        )
        userId = null // Utilisation de null pour indiquer une action système ou sans utilisateur
    }

    if (!entity || typeof entity !== 'string') {
        console.error('Invalid entity:', entity)
        throw new Error("L'entity est invalide.")
    }

    if (!action || typeof action !== 'string') {
        console.error('Invalid action:', action)
        throw new Error("L'action est invalide.")
    }

    let detailsFormatted = details
    if (details && typeof details === 'object') {
        try {
            detailsFormatted = JSON.stringify(details)
        } catch (error) {
            console.error('Error serializing details:', details)
            throw new Error('Le format de details est invalide.')
        }
    } else if (typeof details !== 'string') {
        console.error('Invalid details:', details)
        throw new Error(
            'Les details doivent être soit une chaîne soit un objet.'
        )
    }

    try {
        await AuditLog.create({
            UserID: userId,
            Entity: entity,
            Action: action,
            Details: detailsFormatted,
        })
        console.log(
            `Audit log created for user: ${userId}, entity: ${entity}, action: ${action}`
        )
    } catch (error) {
        console.error('Error creating audit log:', error)
        throw new Error(
            "Une erreur est survenue lors de la création du log d'audit."
        )
    }
}

export const getAuditLogs = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1) // Minimum : 1
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)) // Entre 1 et 100
    const offset = (page - 1) * limit

    try {
        const { rows: logs, count: total } = await AuditLog.findAndCountAll({
            include: [
                {
                    model: User,
                    attributes: ['Username'],
                },
            ],
            order: [['CreatedAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
        })

        res.status(200).json({
            total: total, // Nombre total de logs
            page: parseInt(page), // Page actuelle
            limit: parseInt(limit), // Limite par page
            totalPages: Math.ceil(total / limit), // Nombre total de pages
            logs: logs, // Logs pour cette page
        })
    } catch (error) {
        handleError(res, 'Error retrieving audit logs', error)
    }
}

export const getAuditLogsByUser = async (req, res) => {
    const { userId } = req.params
    const page = Math.max(1, parseInt(req.query.page) || 1) // Minimum : 1
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)) // Entre 1 et 100
    const offset = (page - 1) * limit

    try {
        const { rows: logs, count: total } = await AuditLog.findAndCountAll({
            where: { UserID: userId },
            include: [
                {
                    model: User,
                    attributes: ['Username'],
                },
            ],
            order: [['CreatedAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
        })

        res.status(200).json({
            total: total, // Nombre total de logs pour cet utilisateur
            page: parseInt(page), // Page actuelle
            limit: parseInt(limit), // Limite par page
            totalPages: Math.ceil(total / limit), // Nombre total de pages
            logs: logs, // Logs pour cette page
        })
    } catch (error) {
        handleError(res, 'Error retrieving user audit logs', error)
    }
}
