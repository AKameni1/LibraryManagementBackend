import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import User from './User.js'

const Report = sequelize.define('Report', {
    ReportID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    GeneratedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'UserID'
        },
        allowNull: true
    },
    GeneratedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    ReportPath: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    ReportType: {
        type: DataTypes.ENUM('User Activity', 'Usage Stats', 'Error Log', 'Custom'),
        allowNull: false
    }
}, {
    tableName: 'Report',
    timestamps: false
})

export default Report