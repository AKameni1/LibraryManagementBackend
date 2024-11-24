import { DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'
import sequelize from '../config/db.js'
import Role from './Role.js'
import { DefaultImages } from '../config/defaultImages.js'

const User = sequelize.define(
    'User',
    {
        UserID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        Username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        Email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },

        Password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        CreationDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },

        IsActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },

        RoleID: {
            type: DataTypes.INTEGER,
            references: {
                model: Role,
                key: 'RoleID',
            },
            allowNull: false,
        },

        ProfileImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        LoanCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        LoanLimit: {
            type: DataTypes.INTEGER,
            defaultValue: 3,
        },

        LateReturnCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        PenaltyPoints: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        LoanSuspendedUntil: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: 'User',
        timestamps: false,
        hooks: {
            beforeCreate: (user) => {
                user.Password = bcrypt.hashSync(user.Password)
                if (!user.ProfilePicture) {
                    user.ProfilePicture = DefaultImages.client
                }
            },
            beforeUpdate: async (user) => {
                const currentRole = await Role.findByPk(user.RoleID)
                if (!user.ProfileImage) {
                    switch (currentRole.Name) {
                        case 'admin':
                            user.ProfileImage = DefaultImages.admin
                            break
                        case 'librarian':
                            user.ProfileImage = DefaultImages.librarian
                            break
                        case 'superAdmin':
                            user.ProfileImage = DefaultImages.superAdmin
                            break
                        default:
                            user.ProfileImage = DefaultImages.client
                            break
                    }
                }
            },
        },
    }
)

export default User
