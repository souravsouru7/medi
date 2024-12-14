const Medicine = require('../models/Medicine');

exports.addMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create({ ...req.body, userId: req.user.id });
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll({ where: { userId: req.user.id } });
    res.status(200).json(medicines);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
