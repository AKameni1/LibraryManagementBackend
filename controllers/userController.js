import { validationResult } from 'express-validator'
import { User, Role, Permission } from '../models/index.js'
import { handleError } from '../utils/handleError.js'
import { logAction } from './auditLogController.js'
import { DefaultImages } from '../config/defaultImages.js'
import {
    uploadImage,
    getSignedImageUrl,
    deleteImage,
} from '../services/s3Service.js'
import { Op } from 'sequelize'
import { generateRefreshToken, generateToken } from '../utils/authHelpers.js'

// Récupérer les informations de l'utilisateur
export const getUserInfo = async (req, res) => {
    const userId = req.user.userId // On obtient l'ID depuis le token JWT

    try {
        const user = await User.findByPk(userId, {
            exclude: ['Password'],
            include: [
                {
                    model: Role,
                    as: 'Role',
                    attributes: ['RoleID', 'Name', 'Description'],
                    include: [
                        {
                            model: Permission,
                            as: 'Permissions',
                            attributes: ['PermissionID', 'Name', 'Description'],
                            through: { attributes: [] },
                        },
                    ],
                },
                {
                    model: Permission,
                    as: 'Permissions',
                    attributes: ['PermissionID', 'Name', 'Description'],
                    through: { attributes: [] },
                },
            ],
        })

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur inexistant' })
        }

        // Log action (utilisateur récupéré)
        await logAction(userId, 'User', 'getUserInfo', { userId })

        const userData = await formatUserData(user)

        res.status(200).json({ user: userData })
    } catch (error) {
        console.error(err)
        handleError(res, 'Erreur provenant du serveur', error)
    }
}

export const getUserProfileImage = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findByPk(userId)

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' })
        }
        const profileImageKey = user.ProfileImage

        if (!profileImageKey) {
            return res.status(400).json({
                message: 'Aucune image de profil associée à cet utilisateur.',
            })
        }

        // Générer l'URL signée pour l'image de profil
        const profileImageUrl = await getSignedImageUrl(user.ProfileImage)

        res.status(200).json({ profileImageUrl })
    } catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récupération de l'image de profil.",
            error: error.message,
        })
    }
}

// Créer un nouvel utilisateur
export const createUser = async (req, res) => {
    console.log(req.body)
    const { username, email, password } = req.body

    // Vérifie si les données sont présentes
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' })
    }

    try {
        const defaultRole = await Role.findOne({ where: { Name: 'client' } })

        if (!defaultRole) {
            return res.status(400).json({ message: 'Rôle client non trouvé.' })
        }

        // Vérification si l'utilisateur existe déjà
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ Username: username }, { Email: email }],
            },
        })
        if (existingUser) {
            return res.status(400).json({
                message: `L'utilisateur existe déjà.`,
            })
        }

        let profileImageKey

        // Si un fichier a été envoyé, récupérer son chemin
        if (req.file) {
            try {
                const key = `profile-images/${Date.now()}-${
                    req.file.originalname
                }`
                await uploadImage(key, req.file.buffer, req.file.mimetype)
                profileImageKey = key
            } catch (uploadError) {
                return res.status(500).json({
                    message: "Erreur lors du téléversement de l'image.",
                    error: uploadError.message,
                })
            }
        } else {
            profileImageKey = DefaultImages.client // Image par défaut
        }

        // Création du nouvel utilisateur
        const newUser = await User.create({
            Username: username,
            Email: email,
            Password: password,
            RoleID: defaultRole.RoleID,
            ProfileImage: profileImageKey,
        })

        // Log l'action dans les logs d'audit après la création
        await logAction(null, 'User', 'Create', {
            userId: newUser.UserID,
            username: newUser.Username,
            email: newUser.Email,
        })

        const accessToken = await generateToken(newUser)
        const refreshToken = generateRefreshToken(newUser)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        })

        res.status(201).json({
            message: 'Utilisateur créé avec succès.',
            user: {
                ...newUser.toJSON(),
                profileImageUrl: await getSignedImageUrl(profileImageKey), // URL signée
                // Exclure le mot de passe
            },
            accessToken: accessToken,
        })
    } catch (error) {
        handleError(
            res,
            "Erreur survenu lors de la création de l'utilisateur",
            error
        )
    }
}

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
    const userId = req.user.userId
    console.log(userId)

    const updates = req.body

    console.log('Données reçues pour mise à jour :', updates)

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

        let updatedProfileImageKey = user.ProfileImage
        // Récupérer les anciennes données avant mise à jour
        const previousData = {
            username: user.Username,
            email: user.Email,
            isActive: user.IsActive,
        }

        const updatesFormatted = {}
        if (updates.username) updatesFormatted.Username = updates.username
        if (updates.email) updatesFormatted.Email = updates.email
        if (updates.password) updatesFormatted.Password = updates.password

        // Vérifier si un fichier a été uploadé et mettre à jour l'image de profil
        if (req.file) {
            try {
                const key = `profile-images/${Date.now()}-${
                    req.file.originalname
                }`
                await uploadImage(key, req.file.buffer, req.file.mimetype)

                // Supprimer l'ancienne image si ce n'est pas une image par défaut
                if (!Object.values(DefaultImages).includes(user.ProfileImage)) {
                    try {
                        await deleteImage(user.ProfileImage)
                    } catch (deleteError) {
                        console.warn(
                            `Erreur lors de la suppression de l'ancienne image : ${deleteError.message}`
                        )
                    }
                }

                updatedProfileImageKey = key
                updatesFormatted.ProfileImage = updatedProfileImageKey
            } catch (uploadError) {
                return res.status(500).json({
                    message:
                        "Erreur lors de la mise à jour de l'image de profil.",
                    error: uploadError.message,
                })
            }
        }

        // Si aucun fichier n'a été uploadé, garder l'image actuelle ou appliquer une image par défaut si nécessaire
        if (!req.file && !updates.ProfileImage) {
            updatesFormatted.ProfileImage =
                user.ProfileImage || DefaultImages.client // Utilisation d'une image par défaut si aucune image n'est envoyée
        }

        await user.update(updatesFormatted)
        await user.save()

        // Log l'action dans les logs d'audit après la mise à jour
        await logAction(userId || 0, 'User', 'Update', {
            userId: user.UserID,
            updatedFields: Object.keys(updatesFormatted),
            previous: Object.keys(previousData),
        })

        res.json({
            message: `Utilisateur ${user.Username} mis à jour avec succès`,
            user: {
                ...user.toJSON(),
                profileImageUrl: await getSignedImageUrl(
                    updatedProfileImageKey
                ),
            },
        })
    } catch (error) {
        console.error(error)
        handleError(
            res,
            "Erreur lors de la mise à jour de l'utilisateur.",
            error
        )
    }
}
