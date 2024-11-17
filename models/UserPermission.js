// models/UserPermission.js
import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import User from './User.js'
import Permission from './Permission.js'

// Modèle de table de liaison entre Users et Permissions
// Permet d'associer directement des permissions à des utilisateurs
const UserPermission = sequelize.define('UserPermission', {
    // ID de l'utilisateur (clé étrangère)
    UserID: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'UserID'
        },
        allowNull: false
    },

    // ID de la permission (clé étrangère)
    PermissionID: {
        type: DataTypes.INTEGER,
        references: {
            model: Permission,
            key: 'PermissionID'
        },
        allowNull: false
    }
}, {
    tableName: 'UserPermission',  // Nom explicite de la table
    timestamps: false            // Pas de colonnes created_at/updated_at
})

export default UserPermission