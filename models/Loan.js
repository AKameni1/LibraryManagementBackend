import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import User from './User.js'
import Book from './Book.js'


const Loan = sequelize.define('Loan', {
    LoanID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    UserID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: User,
            key: 'UserID'
        },
        onDelete: 'SET NULL'
    },

    BookID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Book,
            key: 'BookID'
        },
        onDelete: 'SET NULL'
    },

    StartDate: {
        type: DataTypes.DATE,
        allowNull: false
    },

    EndDate: {
        type: DataTypes.DATE,
        allowNull: false
    },

    ReturnDate: {
        type: DataTypes.DATE,
        allowNull: true
    },

    Status: {
        type: DataTypes.ENUM('Borrowed', 'Returned', 'Late'),
        defaultValue: 'Borrowed'
    },

    DueNotificationSent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'Loan',
    timestamps: false
})

export default Loan