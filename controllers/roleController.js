import { User, Role } from '../models/index.js'
import { addPermissionRole, getPermissionsRole, revokePermissionRole } from './permissionController.js'

// Récupérer tous les rôles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.findAll()
        res.status(200).json(roles)
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des rôles', error })
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
        res.status(500).json({ message: 'Erreur lors de la récupération du rôle', error })
    }
}

///

// Obtenir tous les utilisateurs par rôle
export const getUsersByRole = async (req, res) => {
    const { roleName } = req.params

    try {
        const role = await Role.findOne({ where: { Name: roleName } })

        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé' })
        }

        const users = await User.findAll({ where: { RoleID: role.RoleID } })

        res.status(200).json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error })
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
        throw new Error('Le rôle superAdmin ne peut pas être attribué à un utilisateur.')
    }

    user.RoleID = newRole.RoleID
    await user.save()
}

// Rétrograder un utilisateur (changer son rôle vers client)
export const downgradeUserRole = async (userId) => {
    const user = await User.findByPk(userId);
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
export const addPermissionToRole = async (req, res) => {
    const { roleId } = req.params
    const { permissionId } = req.body

    if (!permissionId) {
        return res.status(400).json({ message: 'permissionId est requis.' })
    }

    try {
        await addPermissionRole(roleId, permissionId)
        res.status(200).json({ message: 'Permission ajoutée à l\'utilisateur avec succès.' })
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout de la permission à l\'utilisateur', error: error })
    }
}

// Supprimer une permission d'un rôle
export const revokePermissionFromRole = async (req, res) => {
    const { roleId } = req.params
    const { permissionId } = req.body

    if (!permissionId) {
        return res.status(400).json({ message: 'permissionId est requis.' })
    }

    try {
        await revokePermissionRole(roleId, permissionId)        
        res.status(200).json({ message: 'Permission supprimée du rôle avec succès.' })
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la permission du rôle.', error: error.message })
    }
}

// Obtenir toutes les permissions d'un rôle
export const getPermissionsOfRole = async (req, res) => {
    const { roleId } = req.params 

    try {
        const permissions = await getPermissionsRole(roleId)
        res.status(200).json({ permissions })
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des permissions du rôle.', error: error.message })
    }
}