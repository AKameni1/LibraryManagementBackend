import { User, Role } from '../models/index.js'
import { promoteUserRole, downgradeUserRole } from './roleController.js'
import { addPermission, revokePermission, getPermissionsOfUser } from './permissionController.js'
import { Op } from 'sequelize'
import bcrypt from 'bcryptjs'
import { handleError } from '../utils/handleError.js'


export const createSuperAdmin = async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' })
    }

    try {
        // Cherchez le rôle SuperAdmin
        const superAdminRole = await Role.findOne({ where: { Name: 'superAdmin' } })
        if (!superAdminRole) {
            return res.status(400).json({ message: 'Rôle superAdmin non trouvé.' })
        }

        // Créez le super administrateur
        const superAdmin = await User.create({
            Username: username,
            Email: email,
            Password: password,
            RoleID: superAdminRole.RoleID
        })

        res.status(201).json({ message: 'Super administrateur créé avec succès', user: superAdmin })
    } catch (error) {
        handleError(res, 'Erreur lors de la création du super administrateur', error)
    }
}

// Créer un nouvel utilisateur
export const createUser = async (req, res) => {
    console.log(req.body)
    const { username, email, password } = req.body

    // Vérifie si les données sont présentes
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }    

    try {  

        const defaultRole = await Role.findOne({ where: { Name: 'client' } });

        if (!defaultRole) {
            return res.status(400).json({ message: 'Rôle client non trouvé.' });
        }

        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({
            where: {
              [Op.or]: [
                { Username: username },
                { Email: email }
              ]
            }
          })
        if (existingUser) {
            return res.status(400).json({ message: `L'utilisateur ${existingUser.Username} existe déjà.` })
        }
        
        console.log(password)
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10)

        console.log(hashedPassword)
        
        const newUser = await User.create({ Username: username, Email: email, Password: hashedPassword, RoleID: defaultRole.RoleID })

        res.status(201).json({ message: 'Utilisateur créé avec succès.', user: newUser })
    } catch (error) {
        handleError(res, 'Erreur survenu lors de la création de l\'utilisateur', error)
    }
}

// Obtenir tous les utilisateurs
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        res.json(users)
    } catch (error) {
        handleError(res, 'Erreur lors de la récupération des utilisateurs.', error)
    }
}

// Obtenir un user par son id
export const getUserById = async (req, res) => {
    const { id } = req.params 
    try {
        const user = await User.findByPk(id)

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' })
        }

        res.json(user)
    } catch (error) {
        handleError(res, 'Erreur lors de la récupération de l\'utilisateur.', error)        
    }
}

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
    const { userId } = req.params
    
    try {
        const user = await User.findByPk(userId)

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' })
        }

        await user.destroy()
        res.status(200).json({ message: `L'utilisateur ${user.Username} a été supprimé avec succès.` })
    } catch (error) {
        console.error(error)
        handleError(res, 'Erreur lors de la suppression de l\'utilisateur.', error)        
    }
}

// Rendre actif ou inactif un utilisateur
export const toggleUserActivation = async (req, res) => {
    const { userId } = req.params
    const { isActive } = req.body

    if (!isActive) {
        res.status(400).json({ message: 'isActive requis.' })
    }

    try {
        const user = await User.findByPk(userId)

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' })
        }

        user.IsActive = isActive
        await user.save()
        
        const statusMessage = isActive ? 'activé' : 'désactivé'
        res.json({ message: `Utilisateur ${statusMessage} avec succès.`, user: user })
    } catch (error) {
        handleError(res, 'Erreur lors de la désactivation de l\'utilisateur.', error)
    }
}

// Promouvoir un utilisateur
export const promoteUser = async (req, res) => {
    const { userId } = req.params
    const { newRoleId } = req.body

    if (!newRoleId) {
        return res.status(400).json({ message: 'newRoleId est requis.' })
    }

    try {
        await promoteUserRole(userId, newRoleId)
        res.status(200).json({ message: 'Utilisateur promu avec succès' })
    } catch (error) {
        handleError(res, 'Erreur du serveur', error)
    }
}

// Rétrograder un utilisateur
export const downgradeUser = async (req, res) => {
    const { userId } = req.params

    try {
        await downgradeUserRole(userId)
        res.status(200).json({ message: 'Utilisateur rétrogradé avec succès' })
    } catch (error) {
        handleError(res, 'Erreur du serveur', error)
    }
}

// Ajouter une permission à l'utilisateur
export const addPermissionToUser = async (req, res) => {
    const { userId } = req.params
    const { permissionId } = req.body

    if (!permissionId) {
        return res.status(400).json({ message: 'permissionId est requis.' })
    }

    try {
        await addPermission(userId, permissionId)
        res.status(200).json({ message: 'Permission ajoutée à l\'utilisateur avec succès.' })
    } catch (error) {
        handleError(res, 'Erreur lors de l\'ajout de la permission à l\'utilisateur', error)
    }
}

// Supprimer une permission de l'utilisateur
export const revokePermissionFromUser = async (req, res) => {
    const { userId } = req.params
    const { permissionId } = req.body

    if (!permissionId) {
        return res.status(400).json({ message: 'permissionId est requis.' })
    }

    try {
        await revokePermission(userId, permissionId)
        res.status(200).json({ message: 'Permission révoquée de l\'utilisateur avec succès.' })
    } catch (error) {
        handleError(res, 'Erreur lors de la suppression de la permission de l\'utilisateur', error)
    }
}

// Récupérer toutes les permissions associées à un utilisateur spécifique
export const getUserPermissions = async (req, res) => {
    const { userId } = req.params

    try {
        const permissions = await getPermissionsOfUser(userId)
        res.status(200).json({ permissions: permissions })
    } catch (error) {
        handleError(res, 'Erreur lors de la récupération des permissions', error)
    }
}

export const updateActivationUserAccount = async (userId) => {
    const user = await User.findByPk(userId)
    await user.update({ IsActive: !user.IsActive })
    await user.save()
}