const User = require('../models/User');
const Medicine = require('../models/Medicine');
const AcknowledgmentLog = require('../models/AcknowledgmentLog');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

// Patient Management
exports.getAllPatients = async (req, res) => {
  try {
    // Fetch patients with detailed information
    const patients = await User.findAndCountAll({
      where: { role: 'user' },
      attributes: [
        'id', 
        'first_name', 
        'last_name', 
        'email', 
        'createdAt'
      ],
      order: [['createdAt', 'DESC']],
      // Optional: Add pagination if needed
      // limit: req.query.limit || 10,
      // offset: req.query.offset || 0
    });

    // Respond with both the patients and the total count
    res.status(200).json({
      patients: patients.rows,  // Actual patient data
      totalPatients: patients.count,  // Total number of patients
      count: patients.count  // Alternate key for count
    });
  } catch (error) {
    console.error('Error in getAllPatients:', error);
    res.status(500).json({ 
      message: 'Error fetching patients', 
      error: error.message 
    });
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
    const totalUsers = await User.count({ where: { role: 'patient' } });
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