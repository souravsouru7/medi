const User = require('./User');
const Medicine = require('./Medicine');
const AcknowledgmentLog = require('./AcknowledgmentLog');

// User associations
User.hasMany(Medicine, { foreignKey: 'userId' });
Medicine.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(AcknowledgmentLog, { foreignKey: 'userId' });
AcknowledgmentLog.belongsTo(User, { foreignKey: 'userId' });

// Medicine associations
Medicine.hasMany(AcknowledgmentLog, { foreignKey: 'medicineId' });
AcknowledgmentLog.belongsTo(Medicine, { foreignKey: 'medicineId' });

module.exports = {
  User,
  Medicine,
  AcknowledgmentLog
};
