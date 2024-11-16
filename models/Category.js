import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Category = sequelize.define('Category', {
    CategoryID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    CategoryName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Category',
    timestamps: false
})

export default Category