const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medicine = sequelize.define('Medicine', {
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
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  dosage: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  schedule_time: { 
    type: DataTypes.TIME, 
    allowNull: false
  },
  frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
    allowNull: false,
    defaultValue: 'daily'
  },
  days_of_week: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isValidDays(value) {
        if (this.frequency === 'weekly' && !value) {
          throw new Error('Days of week must be specified for weekly frequency');
        }
        if (value) {
          const days = value.split(',').map(day => parseInt(day));
          const validDays = days.every(day => day >= 0 && day <= 6);
          if (!validDays) {
            throw new Error('Invalid days format. Use 0-6 for Sunday-Saturday');
          }
        }
      }
    }
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'medicines',
  underscored: true,
  timestamps: true
});

module.exports = Medicine;
