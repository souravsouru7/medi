const AcknowledgmentLog = require('../models/AcknowledgmentLog');
const Medicine = require('../models/Medicine');
const { Op } = require('sequelize');

// Get all logs for a user
exports.getUserLogs = async (req, res) => {
  try {
    const logs = await AcknowledgmentLog.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Medicine,
        attributes: ['id', 'name', 'dosage']
      }],
      order: [['taken_at', 'DESC']]
    });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error in getUserLogs:', error);
    res.status(500).json({ message: 'Error fetching logs', error: error.message });
  }
};

// Get specific log by ID
exports.getLogById = async (req, res) => {
  try {
    const log = await AcknowledgmentLog.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [{
        model: Medicine,
        attributes: ['id', 'name', 'dosage']
      }]
    });

    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    res.status(200).json(log);
  } catch (error) {
    console.error('Error in getLogById:', error);
    res.status(500).json({ message: 'Error fetching log', error: error.message });
  }
};

// Create new log
exports.createLog = async (req, res) => {
  try {
    const { medicine_id, status, notes, scheduled_for } = req.body;

    if (!scheduled_for) {
      return res.status(400).json({ 
        message: 'Error creating log', 
        error: 'scheduled_for is required' 
      });
    }

    // Verify medicine belongs to user
    const medicine = await Medicine.findOne({
      where: {
        id: medicine_id,
        user_id: req.user.id
      }
    });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const log = await AcknowledgmentLog.create({
      user_id: req.user.id,
      medicine_id: medicine_id,
      status: status || 'taken',
      notes: notes || '',
      scheduled_for: new Date(scheduled_for),
      taken_at: new Date()
    });

    const logWithMedicine = await AcknowledgmentLog.findOne({
      where: { id: log.id },
      include: [{
        model: Medicine,
        attributes: ['id', 'name', 'dosage']
      }]
    });

    res.status(201).json(logWithMedicine);
  } catch (error) {
    console.error('Error in createLog:', error);
    res.status(400).json({ message: 'Error creating log', error: error.message });
  }
};

// Update log
exports.updateLog = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const log = await AcknowledgmentLog.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    await log.update({
      status: status || log.status,
      notes: notes || log.notes,
      acknowledged_at: new Date()
    });

    const updatedLog = await AcknowledgmentLog.findOne({
      where: { id: log.id },
      include: [{
        model: Medicine,
        attributes: ['id', 'name', 'dosage']
      }]
    });

    res.status(200).json(updatedLog);
  } catch (error) {
    console.error('Error in updateLog:', error);
    res.status(400).json({ message: 'Error updating log', error: error.message });
  }
};

// Delete log
exports.deleteLog = async (req, res) => {
  try {
    const log = await AcknowledgmentLog.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    await log.destroy();
    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (error) {
    console.error('Error in deleteLog:', error);
    res.status(500).json({ message: 'Error deleting log', error: error.message });
  }
};

// Get logs by date range
exports.getLogsByDateRange = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const whereClause = {
      user_id: req.user.id,
      acknowledged_at: {
        [Op.between]: [new Date(start_date), new Date(end_date)]
      }
    };

    const logs = await AcknowledgmentLog.findAll({
      where: whereClause,
      include: [{
        model: Medicine,
        attributes: ['id', 'name', 'dosage']
      }],
      order: [['acknowledged_at', 'DESC']]
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error in getLogsByDateRange:', error);
    res.status(500).json({ message: 'Error fetching logs', error: error.message });
  }
};
