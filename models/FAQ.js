import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const FAQ = sequelize.define('FAQ', {
  question: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'faqs',
});

export default FAQ;
