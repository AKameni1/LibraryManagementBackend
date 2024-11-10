import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Role = sequelize.define('Role', {
    RoleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    Name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

    Description: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: false,
    tableName: 'Role'
})

export default Role