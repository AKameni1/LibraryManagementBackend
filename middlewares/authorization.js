

export const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superAdmin') {
        return res.status(403).json({ message: 'Accès interdit : seul le Super Admin peut accéder à cette ressource' })
    }
    next()
}


export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Accès interdit : seul un administrateur ou super admin peut accéder à cette ressource' })
    }
    next()
}


export const isLibrarian = (req, res, next) => {
    if (req.user.role !== 'librarian' && req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Accès interdit : seul un librarian, admin ou superadmin peut accéder à cette ressource' })
    }
    next()
}


export const isClient = (req, res, next) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({ message: 'Accès interdit : seul un client peut accéder à cette ressource' })
    }
    next()
}

export const isCurrentUser = (req, res, next) => {
    if (req.user.UserID !== req.params.userId) {
        return res.status(403).json({ message: 'Accès interdit' })
    }
    next()
}


