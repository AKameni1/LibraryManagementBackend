import { User, Permission, UserPermission, RolePermission, Role } from '../models/index.js'

// Récupérer toutes les permissions
export const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.findAll()
        res.status(200).json(permissions)
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' })
    }
}

// Créer une permission
export const createPermission = async (req, res) => {
    const { name, description } = req.body

    if (!name || !description) {
        return res.status(400).json({ message: 'Le name et la description de la permission est requis.' })
    }

    try {
        const newPermission = await Permission.create({ Name: name, Description: description })
        res.status(201).json({ message: 'Permission créée avec succès.', permission: newPermission })
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur lors de la création de la permission.' })
    }
}

// Mettre à jour une permission
export const updatePermission = async (req, res) => {
    const { permissionId } = req.params
    const { name, description } = req.body

    try {
        const permission = await Permission.findByPk(permissionId)
        if (!permission) {
            return res.status(404).json({ message: 'Permission introuvable.' })
        }

        permission.Name = name || permission.Name
        permission.Description = description || permission.Description
        await permission.save()

        res.status(200).json({ message: 'Permission mise à jour avec succès.' })
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la permission.' })
    }
}

// Supprimer une permission
export const deletePermission = async (req, res) => {
    const { permissionId } = req.params

    try {
        const permission = await Permission.findByPk(permissionId)
        if (!permission) {
            return res.status(404).json({ message: 'Permission introuvable.' })
        }

        await permission.destroy()
        res.status(200).json({ message: 'Permission supprimée avec succès.' })
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur lors de la suppression de la permission.' })
    }
}

///

// Ajouter une permission à un utilisateur
export const addPermission = async (userId, permissionId) => {
    const user = await User.findByPk(userId)
    const permission = await Permission.findByPk(permissionId)
        

    if (!user || !permission) {
        throw new Error('Utilisateur ou permission introuvable.')
    }

    const existingUserPermission = await UserPermission.findOne({ where: { UserID: userId, PermissionID: permissionId } })
    if (existingUserPermission) {
        throw new Error('L\'utilisateur possède déjà cette permission.')
    }

    await UserPermission.create({ UserID: userId, PermissionID: permissionId })    
}

// Retirer une permission à un utilisateur
export const revokePermission = async (userId, permissionId) => {

    if (!permissionId) {
        throw new Error('permissionId est requis.')
    }

    const userPermission = await UserPermission.findOne({ where: { UserID: userId, PermissionID: permissionId } })

    if (!userPermission) {
        throw new Error('Permission non trouvée pour cet utilisateur')
    }

    await userPermission.destroy()
}

// Obtenir les permissions d'un utilisateur
export const getPermissionsOfUser = async (userId) => {

    const user = await User.findByPk(userId, {
        include: [
            {
                model: Permission,
                as: 'Permissions',
                through: { attributes: [] }
            },
            {
                model: Role,
                as: 'Role',
                include: [
                    {
                        model: Permission,
                        as: 'Permissions',
                        through: { attributes: [] }
                    }
                ]
            }
        ]
    })

    if (!user) {
        throw new Error('Utilisateur non trouvé')
    }

    const userPermissions = user.Permissions.map(permission => ({
        PermissionID: permission.PermissionID,
        Name: permission.Name,
        Description: permission.Description
    }))

    const rolePermissions = user.Role.Permissions.map(permission => ({
        PermissionID: permission.PermissionID,
        Name: permission.Name,
        Description: permission.Description
    }))

    const allPermissions = [...userPermissions, ...rolePermissions]
    const uniquePermissions = Array.from(
        new Map(allPermissions.map(p => [p.PermissionID, p])).values()
    )

    return uniquePermissions
}


///

// Ajouter une permission à un rôle
export const addPermissionRole = async (roleId, permissionId) => {
    const role = await Role.findByPk(roleId)
    const permission = await Permission.findByPk(permissionId)

    if (!role || !permission) {
        throw new Error('Rôle ou permission introuvables.')
    }

    const existingRolePermission = await RolePermission.findOne({
        where: { RoleID: roleId, PermissionID: permissionId }
    })

    if (existingRolePermission) {
        throw new Error('La permission est déjà associée à ce rôle.')
    }

    await RolePermission.create({ RoleID: roleId, PermissionID: permissionId })
    
}

// Supprimer une permission d'un rôle
export const revokePermissionRole = async (roleId, permissionId) => {

    const rolePermission = await RolePermission.findOne({
        where: { RoleID: roleId, PermissionID: permissionId }
    })

    if (!rolePermission) {
        throw new Error('Permission non trouvée pour ce rôle.')
    }

    await rolePermission.destroy()    

}

// Obtenir toutes les permissions d'un rôle
export const getPermissionsRole = async (roleId) => {

    const role = await Role.findByPk(roleId, {
        include: {
            model: Permission,
            as: 'Permissions',
            through: { attributes: [] },
        }
    })

    if (!role) {
        throw new Error('Rôle non trouvé.')
    }

    const permissions = role.Permissions.map(permission => ({
        PermissionID: permission.PermissionID,
        Name: permission.Name,
        Description: permission.Description
    }))

    return permissions
}