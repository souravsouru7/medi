const AcknowledgmentLog = require('../models/AcknowledgmentLog');

exports.addLog = async (req, res) => {
  try {
    const log = await AcknowledgmentLog.create({ ...req.body, userId: req.user.id });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
