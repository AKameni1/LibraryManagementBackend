import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

export const loginUser = async (req, res) => {
    // Vérification des erreurs de validation
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { username, password } = req.body

    try {
        const user = await User.findOne({ where: { Username: username } })

        if (!user) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' })
        }

        const isMatch = await bcrypt.compare(password, user.Password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' })
        }
        
        // Générer le token JWT
        const payload = {
            userId: user.UserID,
            email: user.Email
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

        return res.status(200).json({ token })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Erreur provenant du serveur' })
    }
}