// models/FAQ.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const FAQ = sequelize.define('faq', {
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
  timestamps: false
});

export default FAQ;