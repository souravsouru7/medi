const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Medicine = sequelize.define('Medicine', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  name: { type: DataTypes.STRING, allowNull: false },
  dosage: { type: DataTypes.STRING, allowNull: false },
  scheduleTime: { type: DataTypes.TIME, allowNull: false },
});

module.exports = Medicine;
