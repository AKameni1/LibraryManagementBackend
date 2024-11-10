import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User, Role } from '../models/index.js'

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
        
        const token = await generateToken(user)

        return res.status(200).json({ token: token })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: 'Erreur provenant du serveur' })
    }
}

const generateToken = async (user) => {
    const userWithRole = await User.findByPk(user.UserID, {
        include: {
            model: Role,
            as: 'Role'
        }
    })

    if (!userWithRole) {
        throw new Error('Utilisateur non trouvé')
    }

    const payload = {
        userId: userWithRole.UserID,
        username: userWithRole.Username,
        email: userWithRole.Email,
        role: userWithRole.Role.Name
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })

    return token
}