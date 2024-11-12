import { validationResult } from 'express-validator'
import { User } from '../models/index.js'
import { generateToken, generateRefreshToken } from '../utils/authHelpers.js'
import { handleError } from '../utils/handleError.js'
import jwt from 'jsonwebtoken'


export const loginUser = async (req, res) => {
    // Vérification des erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body)
    
    const { username, email } = req.body

    try {
        const user = await User.findOne({ where: { Username: username, Email: email } })    
        console.log(user)
        
        if (!user) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' })
        }

        if (!user.IsActive) {
            return res.status(403).json({ message: `Votre compte a été suspendu. Veuillez adresser une requete à l'adresse. ${process.env.EMAIL_USER}` })
        }
        
        // const isMatch = bcrypt.compareSync(bcrypt.hashSync(password), user.Password)

        // console.log(`password match: ${isMatch}`)
        

        // if (!isMatch) {
        //     return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' })
        // }
        
        const token = await generateToken(user)
        const refreshToken = generateRefreshToken(user)

        return res.status(200).json({ token: token, refreshToken: refreshToken })
    } catch (err) {
        console.error(err)
        handleError(res, 'Erreur provenant du serveur', err)
    }
}

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token manquant' })
    }

    try {
        // Vérification du refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

        // Vérification que l'utilisateur existe
        const user = await User.findByPk(decoded.userId)
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' })
        }

        // Générer un nouveau access token
        const newAccessToken = await generateToken(user)

        // Renvoie du nouveau token
        return res.status(200).json({ accessToken: newAccessToken })
    } catch (err) {
        console.error(err)
        return handleError(res, 'Erreur lors du renouvellement du token', err)
    }
}