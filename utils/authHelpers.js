import jwt from 'jsonwebtoken'
import { User, Role } from '../models/index.js'
import authConfig from '../config/auth.js'

export const generateToken = async (user) => {
    const userWithRole = await User.findByPk(user.UserID, {
        include: {
            model: Role,
            as: 'Role',
        },
    })

    if (!userWithRole) {
        throw new Error('Utilisateur non trouvé')
    }

    const payload = {
        userId: userWithRole.UserID,
        username: userWithRole.Username,
        email: userWithRole.Email,
        role: userWithRole.Role.Name,
    }

    const accessToken = jwt.sign(payload, authConfig.JWT_SECRET, {
        expiresIn: authConfig.JWT_EXPIRATION,
    })

    return accessToken
}

export const generateRefreshToken = (user) => {
    return jwt.sign({ userId: user.UserID }, authConfig.JWT_REFRESH, {
        expiresIn: authConfig.JWT_REFRESH_EXPIRATION,
    })
}
