import { AuditLog, User } from '../models/index.js'
import { handleError } from '../utils/handleError.js'

export const logAction = async (userId, entity, action, details) => {
    try {
        await AuditLog.create({
            UserID: userId,
            Entity: entity,
            Action: action,
            Details: typeof details === 'object' ? JSON.stringify(details) : details
        })
    } catch (error) {
        console.error('Error creating audit log:', error)
    }
}

export const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            include: [{
                model: User,
                attributes: ['Username']
            }],
            order: [['Timestamp', 'DESC']],
            limit: 100 // Basic pagination
        })
        res.status(200).json(logs)
    } catch (error) {
        handleError(res, 'Error retrieving audit logs', error)
    }
}

export const getAuditLogsByUser = async (req, res) => {
    const { userId } = req.params

    try {
        const logs = await AuditLog.findAll({
            where: { UserID: userId },
            include: [{
                model: User,
                attributes: ['Username']
            }],
            order: [['Timestamp', 'DESC']],
            limit: 100
        })
        res.status(200).json(logs)
    } catch (error) {
        handleError(res, 'Error retrieving user audit logs', error)
    }
}