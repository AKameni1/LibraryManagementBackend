import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import Category from './Category.js'


const Book = sequelize.define('Book', {
    BookID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    Title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    Author: {
        type: DataTypes.STRING,        
    },

    ISBN: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false
    },

    PublishedYear: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    CategoryID: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'CategoryID',
        },
    },

    Availability: {
        type: DataTypes.ENUM('Available', 'Borrowed', 'Reserved'),
        defaultValue: 'Available',
    }
}, {
    tableName: 'Book',
    timestamps: false
})


export default Book