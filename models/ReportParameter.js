import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import Report from './Report.js'

const ReportParameter = sequelize.define('ReportParameter', {
    ParameterID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ReportID: {
        type: DataTypes.INTEGER,
        references: {
            model: Report,
            key: 'ReportID'
        },
        allowNull: false
    },
    ParameterName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ParameterValue: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'ReportParameter',
    timestamps: false
})

export default ReportParameter