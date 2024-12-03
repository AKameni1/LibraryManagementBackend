import jwt from 'jsonwebtoken'

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer', '').trim()

    if (!token) {
        return res.status(403).json({ message: 'Accès refusé, token manquant' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res
                .status(401)
                .json({ message: 'Token expiré, veuillez vous reconnecter.' })
        }
        return res.status(401).json({ message: 'Token invalide.' })
    }
}

export default authenticateJWT
