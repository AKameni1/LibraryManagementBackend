import jwt from 'jsonwebtoken'
import { User, Role } from '../models/index.js'

export const generateToken = async (user) => {
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