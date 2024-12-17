const User = require('../models/User');
const Medicine = require('../models/Medicine');
const AcknowledgmentLog = require('../models/AcknowledgmentLog');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Patient Management
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await User.findAll({
      where: { role: 'patient' },
      attributes: { exclude: ['password'] }
    });
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error in getAllPatients:', error);
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await User.findOne({
      where: { id: req.params.id, role: 'patient' },
      attributes: { exclude: ['password'] }
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error('Error in getPatientById:', error);
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const patient = await User.findOne({
      where: { id: req.params.id, role: 'patient' }
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    if (first_name) patient.first_name = first_name;
    if (last_name) patient.last_name = last_name;
    if (email) patient.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      patient.password = hashedPassword;
    }

    await patient.save();

    const updatedPatient = await User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ['password'] }
    });

    res.status(200).json(updatedPatient);
  } catch (error) {
    console.error('Error in updatePatient:', error);
    res.status(500).json({ message: 'Error updating patient', error: error.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await User.findOne({
      where: { id: req.params.id, role: 'patient' }
    });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    await patient.destroy();
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (error) {
    console.error('Error in deletePatient:', error);
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
};

// Medicine Management
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll({
      include: [{
        model: User,
        attributes: ['id', 'first_name', 'last_name', 'email']
      }]
    });
    res.status(200).json(medicines);
  } catch (error) {
    console.error('Error in getAllMedicines:', error);
    res.status(500).json({ message: 'Error fetching medicines', error: error.message });
  }
};

exports.createMedicine = async (req, res) => {
  try {
    const { name, description, dosage, userId, frequency, daysOfWeek, dayOfMonth, active } = req.body;
    const medicine = await Medicine.create({
      name,
      description,
      dosage,
      userId,
      frequency,
      daysOfWeek,
      dayOfMonth,
      active: active !== undefined ? active : true
    });
    res.status(201).json(medicine);
  } catch (error) {
    console.error('Error in createMedicine:', error);
    res.status(400).json({ message: 'Error creating medicine', error: error.message });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const { name, description, dosage, frequency, daysOfWeek, dayOfMonth, active } = req.body;
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    await medicine.update({
      name,
      description,
      dosage,
      frequency,
      daysOfWeek,
      dayOfMonth,
      active
    });
    res.status(200).json(medicine);
  } catch (error) {
    console.error('Error in updateMedicine:', error);
    res.status(400).json({ message: 'Error updating medicine', error: error.message });
  }
};

exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    await medicine.destroy();
    res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Error in deleteMedicine:', error);
    res.status(500).json({ message: 'Error deleting medicine', error: error.message });
  }
};

// Logs Management
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await AcknowledgmentLog.findAll({
      include: [{
        model: User,
        attributes: ['id', 'first_name', 'last_name', 'email']
      }, {
        model: Medicine,
        attributes: ['id', 'name', 'dosage', 'frequency']
      }],
      order: [['taken_at', 'DESC']]
    });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error in getAllLogs:', error);
    res.status(500).json({ message: 'Error fetching logs', error: error.message });
  }
};

exports.getFilteredLogs = async (req, res) => {
  try {
    const { startDate, endDate, userId, medicineId } = req.query;
    const where = {};

    if (startDate && endDate) {
      where.taken_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (userId) {
      where.user_id = userId;
    }

    if (medicineId) {
      where.medicine_id = medicineId;
    }

    const logs = await AcknowledgmentLog.findAll({
      where,
      include: [{
        model: User,
        attributes: ['id', 'first_name', 'last_name', 'email']
      }, {
        model: Medicine,
        attributes: ['id', 'name', 'dosage', 'frequency']
      }],
      order: [['taken_at', 'DESC']]
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error in getFilteredLogs:', error);
    res.status(500).json({ message: 'Error fetching logs', error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalMedicines = await Medicine.count();
    const totalLogs = await AcknowledgmentLog.count();

    const recentLogs = await AcknowledgmentLog.findAll({
      limit: 5,
      order: [['taken_at', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'first_name', 'last_name', 'email']
      }, {
        model: Medicine,
        attributes: ['id', 'name', 'dosage', 'frequency']
      }]
    });

    res.status(200).json({
      totalUsers,
      totalMedicines,
      totalLogs,
      recentLogs
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};