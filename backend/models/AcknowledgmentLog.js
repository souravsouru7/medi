const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Medicine = require('./Medicine');

const AcknowledgmentLog = sequelize.define('AcknowledgmentLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  medicineId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Medicine, key: 'id' } },
  status: { type: DataTypes.STRING, allowNull: false }, // taken/missed
  timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
});

module.exports = AcknowledgmentLog;
