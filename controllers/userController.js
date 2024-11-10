import { validationResult } from 'express-validator'
import { User, Role } from '../models/index.js'
import { promoteUserRole, downgradeUserRole } from './roleController.js'
import { addPermission, revokePermission, getPermissionsOfUser } from './permissionController.js'
import { Op } from 'sequelize'
import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'


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
        res.status(500).json({ message: 'Erreur lors de la création du super administrateur', error })
    }
}


// Récupérer les informations de l'utilisateur
export const getUserInfo = async (req, res) => {
    const userId = req.user.userId // On obtient l'ID depuis le token JWT

    try {        
        const user = await User.findByPk(userId, {
            include: [{
                model: Role,
                as: 'Role',
                attributes: ['RoleID', 'Name', 'Description']
            }]
        })

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur inexistant' })
        }

        res.status(200).json({
            userId: user.UserID,
            username: user.Username,
            email: user.Email,
            isActive: user.IsActive,
            createdAt: user.CreationDate,
            role: {
                roleId: user.Role.RoleID,
                name: user.Role.Name,
                description: user.Role.Description
            }
        })
    } catch (error) {
        console.error(err)
        res.status(500).json({ message: 'Erreur provenant du serveur' })
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
        res.status(500).json({ message: `Erreur survenu lors de la création de l'utilisateur. Error: ${error.message}` })
    }
}

// Obtenir tous les utilisateurs
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        res.json(users)
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' })
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
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur.'})
    }
}

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
    const { userId } = req.params
    console.log(req.params)
    
    const updates = req.body
    
    console.log("Données reçues pour mise à jour :", updates);
    
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    
    try {
        console.log('ID reçu : ', userId)
        
        const user = await User.findByPk(userId)
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' })
        }

        const updatesFormatted = {}
        if (updates.username) updatesFormatted.Username = updates.username
        if (updates.email) updatesFormatted.Email = updates.email
        if (updates.password) updatesFormatted.Password = await bcrypt.hash(updates.password, 10)

        await user.update(updatesFormatted)
        await user.save()

        res.json({ message: `Utilisateur ${user.Username} mis à jour avec succès`, user: user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur.' })        
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
        res.status(500).json({ message: `Erreur lors de la suppression de l'utilisateur. ${error.message}` })
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
        res.status(500).json({ message: `Erreur lors de la désactivation de l'utilisateur. Error: ${error.message}`})
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
        res.status(400).json({ message: error.message })
    }
}

// Rétrograder un utilisateur
export const downgradeUser = async (req, res) => {
    const { userId } = req.params

    try {
        await downgradeUserRole(userId)
        res.status(200).json({ message: 'Utilisateur rétrogradé avec succès' })
    } catch (error) {
        res.status(400).json({ message: error.message })
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
        res.status(500).json({ message: 'Erreur lors de l\'ajout de la permission à l\'utilisateur', error: error })
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
        res.status(500).json({ message: 'Erreur lors de la suppression de la permission de l\'utilisateur', error: error })
    }
}

// Récupérer toutes les permissions associées à un utilisateur spécifique
export const getUserPermissions = async (req, res) => {
    const { userId } = req.params

    try {
        const permissions = await getPermissionsOfUser(userId)
        res.status(200).json({ permissions: permissions })
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des permissions', error: error })
    }
}