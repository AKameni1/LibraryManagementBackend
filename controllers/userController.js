import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import { User, Role } from '../models/index.js'
import { handleError } from '../utils/handleError.js'
import { Op } from 'sequelize'

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
        handleError(res, 'Erreur provenant du serveur', error)
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

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
    const { userId } = req.params
    console.log(req.params)
    
    const updates = req.body
    
    console.log("Données reçues pour mise à jour :", updates)
    
    
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
        handleError(res, 'Erreur lors de la mise à jour de l\'utilisateur.', error)     
    }
}