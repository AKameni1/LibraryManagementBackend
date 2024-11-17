// utils/authHelpers.js
import jwt from 'jsonwebtoken';

// Génère un JWT d'accès valide pour 24h
// @param user - Objet utilisateur contenant UserID, Username et RoleID
// @return - Token JWT signé
export const generateToken = async (user) => {
    return jwt.sign(
        {
            UserID: user.UserID,
            Username: user.Username,
            RoleID: user.RoleID
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

// Génère un token de rafraîchissement valide pour 7 jours
// @param user - Objet utilisateur contenant UserID et RoleID
// @return - Token de rafraîchissement JWT signé
export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            UserID: user.UserID,
            RoleID: user.RoleID
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
};