const User = require('./User');
const Medicine = require('./Medicine');
const AcknowledgmentLog = require('./AcknowledgmentLog');

// User-Medicine associations
User.hasMany(Medicine, { foreignKey: 'userId' });
Medicine.belongsTo(User, { foreignKey: 'userId' });

// User-AcknowledgmentLog associations
User.hasMany(AcknowledgmentLog, { foreignKey: 'userId' });
AcknowledgmentLog.belongsTo(User, { foreignKey: 'userId' });

// Medicine-AcknowledgmentLog associations
Medicine.hasMany(AcknowledgmentLog, { foreignKey: 'medicineId' });
AcknowledgmentLog.belongsTo(Medicine, { foreignKey: 'medicineId' });

module.exports = {
  User,
  Medicine,
  AcknowledgmentLog
};
