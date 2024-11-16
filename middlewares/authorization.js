import { User, Role} from '../models/index.js'

export const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superAdmin') {
        return res.status(403).json({ message: 'Accès interdit : seul le Super Admin peut accéder à cette ressource' })
    }
    next()
}


export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superAdmin') {
        return res.status(403).json({ message: 'Accès interdit : seul un administrateur ou super admin peut accéder à cette ressource' })
    }
    next()
}


export const isLibrarian = (req, res, next) => {
    if (req.user.role !== 'librarian' && req.user.role !== 'admin' && req.user.role !== 'superAdmin') {
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


export const hasDeleteUserPermission = async (req, res, next) => {
    const userId = req.user.id
    const permissions = await getPermissionsOfUser(userId)

    if (!permissions.includes('delete_user')) {
        return res.status(403).json({ message: 'Accès interdit : permission non accordée' })
    }

    next()
}

export const hasUpdateUserPermission = async (req, res, next) => {
    const userId = req.user.id
    const permissions = await getPermissionsOfUser(userId)

    if (!permissions.includes('update_user')) {
        return res.status(403).json({ message: 'Accès interdit : permission non accordée' })
    }

    next()
}


export const preventSuperAdminDeletion = async (req, res, next) => {
    const { userId } = req.params

    try {        
        const superAdminRole = await Role.findOne({ where: { Name: 'superAdmin' } });
        
        if (!superAdminRole) {
            return next()
        }

        const user = await User.findOne({ where: { UserID: userId, RoleID: superAdminRole.RoleID } })

        if (user) {
            return res.status(403).json({ message: "Le super administrateur ne peut pas être supprimé." });
        }

        next()
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la vérification du super administrateur.", error: error.message });
    }
}

