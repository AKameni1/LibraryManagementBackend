import rateLimit from 'express-rate-limit'

// Limitation pour les connexions (login)
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limite de 10 requêtes
    message: 'Trop de tentatives de connexion, réessayez dans 15 minutes.',
})

// Limitation pour le rafraîchissement des tokens
export const refreshTokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limite de 20 requêtes
    message: 'Trop de tentatives, réessayez dans 15 minutes.',
})
