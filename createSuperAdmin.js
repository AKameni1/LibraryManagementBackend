import { User, Role } from './models/index.js'
import bcrypt from 'bcryptjs'
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

        const hashedPassword = await bcrypt.hash('YourSecurePassword123', 10)

        const superAdmin = await User.create({
            Username: 'SuperAdmin',
            Email: 'superadmin@example.com',
            Password: hashedPassword,
            RoleID: superAdminRole.RoleID,
        })

        console.log('Super administrateur créé avec succès :', superAdmin)
        process.exit(0)
    } catch (error) {
        console.error('Erreur :', error)
        process.exit(1)
    }
})()
