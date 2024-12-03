import { validationResult } from 'express-validator'
import { User, Role, Permission } from '../models/index.js'
import { generateToken, generateRefreshToken } from '../utils/authHelpers.js'
import { handleError } from '../utils/handleError.js'
import authConfig from '../config/auth.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { formatUserData } from '../helpers/formatUserData.js'

export const loginUser = async (req, res) => {
    // Vérification des erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body)

    const { email, password } = req.body

    try {
        const user = await User.findOne({
            where: { Email: email },
            include: [
                {
                    model: Permission,
                    as: 'Permissions',
                    attributes: ['PermissionID', 'Name', 'Description'],
                    through: { attributes: [] },
                },
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
            ],
        })
        console.log(user)

        if (!user) {
            return res.status(400).json({
                message: 'Adresse email ou mot de passe incorrect',
            })
        }

        const isMatch = await bcrypt.compare(password, user.Password)

        console.log(`password match: ${isMatch}`)

        if (!isMatch) {
            return res.status(400).json({
                message: 'Adresse email ou mot de passe incorrect',
            })
        }

        if (!user.IsActive) {
            return res.status(403).json({
                message: `Votre compte a été suspendu. Veuillez adresser une requete à l'adresse. ${process.env.EMAIL_USER}`,
            })
        }

        const token = await generateToken(user)
        const refreshToken = generateRefreshToken(user)

        const userData = formatUserData(user)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Utilise HTTPS en production
            sameSite: 'strict', // Protège contre les attaques CSRF
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            accessToken: token,
            user: userData,
        })
    } catch (err) {
        console.error(err)
        handleError(res, 'Erreur provenant du serveur', err)
    }
}

export const refreshAccessToken = async (req, res) => {
    // Vérification des erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body)
    const refreshToken = req.cookies.refreshToken
    console.log('Refresh Token reçu:', refreshToken)

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token manquant' })
    }

    try {
        // Vérification du refresh token
        const decoded = jwt.verify(refreshToken, authConfig.JWT_REFRESH)
        console.log('Refresh token décodé:', decoded)

        // Vérification que l'utilisateur existe
        const user = await User.findByPk(decoded.userId, {
            include: [
                {
                    model: Permission,
                    as: 'Permissions',
                    attributes: ['PermissionID', 'Name', 'Description'],
                    through: { attributes: [] },
                },
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
            ],
        })
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }

        // Générer un nouveau access token
        const newAccessToken = await generateToken(user)
        console.log('Nouveau access token généré:', newAccessToken)

        const userData = formatUserData(user)

        // Renvoie du nouveau token
        return res.status(200).json({
            accessToken: newAccessToken,
            user: userData,
        })
    } catch (err) {
        console.error('Erreur lors du rafraîchissement du token:', err)
        return handleError(res, 'Erreur lors du renouvellement du token', err)
    }
}

export const logoutUser = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    })
    res.json({ message: 'Déconnecté avec succès' })
}
