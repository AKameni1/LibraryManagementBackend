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
        res.status(401).json({ message: 'Token invalide ou expiré' })
    }
}

export default authenticateJWT