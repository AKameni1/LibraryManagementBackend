import { DefaultImages } from './config/defaultImages.js'
import { User, Role } from './models/index.js'
;(async () => {
    try {
        const superAdminRole = await Role.findOne({
            where: { Name: 'superAdmin' },
        })
        if (!superAdminRole) {
            console.error('Rôle superAdmin introuvable.')
            process.exit(1)
        }

        const existingSuperAdmin = await User.findOne({
            where: { RoleID: superAdminRole.RoleID },
        })

        if (existingSuperAdmin) {
            console.log('Un super administrateur existe déjà.')
            process.exit(1)
        }

        const superAdmin = await User.create({
            Username: 'Arthur',
            Email: 'superadmin@example.com',
            Password: 'Arthur123',
            RoleID: superAdminRole.RoleID,
            ProfileImage: DefaultImages.superAdmin,
        })

        console.log('Super administrateur créé avec succès :', superAdmin)
        process.exit(0)
    } catch (error) {
        console.error('Erreur :', error)
        process.exit(1)
    }
})()
