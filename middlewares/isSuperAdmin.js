

export const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superAdmin') {
        return res.status(403).json({ message: 'Accès interdit : seul le Super Admin peut accéder à cette ressource' })
    }
    next()
}