import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import User from './User.js'
import Book from './Book.js'


const Reservation = sequelize.define('Reservation',  {
    ReservationID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'UserID'
        },
        onDelete: 'CASCADE'
    },

    BookID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Book,
            key: 'BookID'
        },
        onDelete: 'CASCADE'
    },

    ReservationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    Status: {
        type: DataTypes.ENUM('Reserved', 'Notification Sent', 'Cancelled'),
        defaultValue: 'Reserved'
    },

    ReservationEndDate: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'Reservation',
    timestamps: false
})


export default Reservation