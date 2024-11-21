import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const FAQ = sequelize.define('FAQ', {
    FAQID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Question: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    Answer: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    UpdatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'faq',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
});

export default FAQ;