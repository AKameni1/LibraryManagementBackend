// models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

// Modèle User - Gestion des utilisateurs du système
// Stocke les informations des utilisateurs, leurs droits d'emprunt et pénalités
const User = sequelize.define('user', {
    // Identifiant unique de l'utilisateur
    // Auto-incrémenté pour chaque nouvel utilisateur
    UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    // Informations d'authentification et contact
    // Utilisées pour la connexion et la communication
    Username: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true          // Username unique requis
    },
    Email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true         // Email unique requis pour communications
    },
    Password: {
        type: DataTypes.TEXT,
        allowNull: false     // Stocké sous forme hashée
    },

    // Métadonnées du compte utilisateur
    // Gestion du statut et des droits
    CreationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW    // Date de création automatique
    },
    IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true    // Compte actif par défaut
    },
    RoleID: {
        type: DataTypes.INTEGER,
        allowNull: false      // Référence vers la table des rôles
    },

    // Statistiques et limites d'emprunt
    // Suivi des emprunts et gestion des limitations
    LoanCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0       // Nombre d'emprunts en cours
    },
    LoanLimit: {
        type: DataTypes.INTEGER,
        defaultValue: 3       // Maximum d'emprunts simultanés autorisés
    },

    // Système de pénalités et suspensions
    // Gestion des infractions et restrictions
    LateReturnCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0       // Compteur des retours tardifs
    },
    PenaltyPoints: {
        type: DataTypes.INTEGER,
        defaultValue: 0       // Cumul des points de pénalité
    },
    LoanSuspendedUntil: {
        type: DataTypes.DATE,
        allowNull: true       // Date de fin de suspension des emprunts
    }
}, {
    tableName: 'user',
    timestamps: false         // Pas de tracking automatique created_at/updated_at
});

export default User;