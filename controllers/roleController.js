import { User, Role, Permission } from '../models/index.js'
import { handleError } from '../utils/handleError.js'
import {
    addPermissionRole,
    getPermissionsRole,
    revokePermissionRole,
} from './permissionController.js'
import sequelize from '../config/db.js'

// Récupérer tous les rôles
export const getAllRoles = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1) // Minimum : 1
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)) // Entre 1 et 100
    const offset = (page - 1) * limit

    try {
        const { rows: roles, count: total } = await Role.findAndCountAll({
            limit: limit,
            offset: offset,
        })

        res.status(200).json({
            total: total, // Nombre total de rôle
            page: parseInt(page), // Page actuelle
            limit: parseInt(limit), // Limite par page
            totalPages: Math.ceil(total / limit), // Nombre total de pages
            roles: roles,
        })
    } catch (error) {
        handleError(res, 'Erreur lors de la récupération des rôles', error)
    }
}

// Récupérer un rôle par son ID
export const getRoleById = async (req, res) => {
    const { roleId } = req.params

    try {
        const role = await Role.findByPk(roleId)
        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé' })
        }
        res.status(200).json(role)
    } catch (error) {
        handleError(res, 'Erreur lors de la récupération du rôle', error)
    }
}

///

// Obtenir tous les utilisateurs par rôle
export const getUsersByRole = async (req, res) => {
    const { roleName } = req.params

    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10))
    const offset = (page - 1) * limit

    try {
        const role = await Role.findOne({ where: { Name: roleName } })

        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé' })
        }

        const { rows: users, count: total } = await User.findAndCountAll({
            where: { RoleID: role.RoleID },
            limit: limit,
            offset: offset,
            order: [['CreatedAt', 'DESC']],
        })

        res.status(200).json({
            total: total, // Nombre total d'utilisateurs
            page: parseInt(page), // Page actuelle
            limit: parseInt(limit), // Limite par page
            totalPages: Math.ceil(total / limit), // Nombre total de pages
            users: users,
        })
    } catch (error) {
        console.error(error)
        handleError(
            res,
            'Erreur lors de la récupération des utilisateurs',
            error
        )
    }
}

// Promouvoir un utilisateur (changer son rôle)
export const promoteUserRole = async (userId, newRoleId) => {
    const user = await User.findByPk(userId)
    const newRole = await Role.findByPk(newRoleId)

    if (!user || !newRole) {
        throw new Error('Utilisateur ou rôle non trouvé.')
    }

    if (newRole.Name === 'superAdmin') {
        throw new Error(
            'Le rôle superAdmin ne peut pas être attribué à un utilisateur.'
        )
    }

    user.RoleID = newRole.RoleID
    await user.save()
}

// Rétrograder un utilisateur (changer son rôle vers client)
export const downgradeUserRole = async (userId) => {
    const user = await User.findByPk(userId)
    if (!user) {
        throw new Error('Utilisateur non trouvé')
    }

    const clientRole = await Role.findOne({ where: { Name: 'client' } })
    if (!clientRole) {
        throw new Error('Rôle client introuvable')
    }

    user.RoleID = clientRole.RoleID
    await user.save()
}

///

// Ajouter une permission à un rôle
export const addPermissionsToRole = async (req, res) => {
    const { roleId } = req.params
    const { permissionIds } = req.body

    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
        return res.status(400).json({
            message:
                'Un tableau de permissionIds est requis et ne doit pas être vide.',
        })
    }

    const transaction = await sequelize.transaction()
    try {
        const role = await Role.findByPk(roleId, { transaction })
        if (!role) {
            await transaction.rollback()
            return res.status(404).json({ message: 'Rôle non trouvé.' })
        }

        const existingPermissions = await Permission.findAll({
            where: { PermissionID: permissionIds },
            attributes: ['PermissionID'],
            transaction,
        })

        const existingPermissionIds = existingPermissions.map(
            (perm) => perm.PermissionID
        )
        const invalidPermissionIds = permissionIds.filter(
            (id) => !existingPermissionIds.includes(id)
        )

        if (invalidPermissionIds.length > 0) {
            await transaction.rollback()
            return res.status(400).json({
                message: 'Certains IDs de permissions sont invalides.',
                invalidPermissionIds,
            })
        }

        // Ajouter les permissions valides au rôle
        await addPermissionRole(roleId, existingPermissionIds, transaction)

        await transaction.commit()
        res.status(200).json({
            message: 'Permissions ajoutées au rôle avec succès.',
            addedPermissions: existingPermissionIds,
        })
    } catch (error) {
        await transaction.rollback()
        handleError(
            res,
            "Erreur lors de l'ajout des permissions au rôle.",
            error
        )
    }
}

// Supprimer une permission d'un rôle
export const revokePermissionsFromRole = async (req, res) => {
    const { roleId } = req.params
    const { permissionIds } = req.body

    // Validation : vérifier si `permissionIds` est un tableau valide
    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
        return res.status(400).json({
            message:
                'Un tableau de permissionIds est requis et ne doit pas être vide.',
        })
    }

    const transaction = await sequelize.transaction()
    try {
        // Vérification si le rôle existe
        const role = await Role.findByPk(roleId, { transaction })
        if (!role) {
            await transaction.rollback()
            return res.status(404).json({ message: 'Rôle non trouvé.' })
        }

        // Vérification des permissions existantes dans le rôle
        const existingPermissions = await getPermissionsRole(roleId)
        const existingPermissionIds = existingPermissions.map(
            (perm) => perm.PermissionID
        )

        // Filtrer les IDs valides et invalides
        const validPermissionIds = permissionIds.filter((id) =>
            existingPermissionIds.includes(id)
        )
        const invalidPermissionIds = permissionIds.filter(
            (id) => !existingPermissionIds.includes(id)
        )

        if (validPermissionIds.length === 0) {
            await transaction.rollback()
            return res.status(400).json({
                message: 'Aucune permission valide trouvée pour suppression.',
                invalidPermissionIds,
            })
        }

        // Supprimer les permissions valides en lot
        const removedPermissions = await revokePermissionRole(
            roleId,
            validPermissionIds,
            transaction
        )

        // Commit de la transaction si tout est réussi
        await transaction.commit()

        res.status(200).json({
            message: 'Permissions supprimées du rôle avec succès.',
            removedPermissions: removedPermissions,
            invalidPermissions:
                invalidPermissionIds.length > 0
                    ? invalidPermissionIds
                    : undefined,
        })
    } catch (error) {
        // Annulation de la transaction en cas d'échec
        await transaction.rollback()
        handleError(
            res,
            'Erreur lors de la suppression des permissions du rôle.',
            error
        )
    }
}

// Obtenir toutes les permissions d'un rôle
export const getPermissionsOfRole = async (req, res) => {
    const { roleId } = req.params

    try {
        // Vérification si le rôle existe
        const role = await Role.findByPk(roleId)
        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé.' })
        }

        // Récupérer les permissions avec la fonction utilitaire
        const permissions = await getPermissionsRole(roleId)

        res.status(200).json({
            role: role.Name,
            permissions: permissions,
        })
    } catch (error) {
        handleError(
            res,
            'Erreur lors de la récupération des permissions du rôle.',
            error
        )
    }
}
