const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AcknowledgmentLog = sequelize.define('AcknowledgmentLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {  
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  medicine_id: {  
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Medicines',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('taken', 'skipped', 'delayed'),
    allowNull: false,
    defaultValue: 'taken'
  },
  taken_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  scheduled_for: {
    type: DataTypes.DATE,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'acknowledgment_logs',
  underscored: true,
  timestamps: true,
  indexes: [
    {
      fields: ['user_id', 'medicine_id', 'taken_at'],
      name: 'acknowledgment_user_medicine_time'
    }
  ]
});

module.exports = AcknowledgmentLog;
