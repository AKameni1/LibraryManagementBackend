import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Permission = sequelize.define('Permission', {
    PermissionID: {
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
    tableName: 'Permission'
})


export default Permission