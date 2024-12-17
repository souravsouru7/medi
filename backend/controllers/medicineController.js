const Medicine = require('../models/Medicine');
const AcknowledgmentLog = require('../models/AcknowledgmentLog');
const { Op } = require('sequelize');

// Get all medicines for a specific user
exports.getUserMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(medicines);
  } catch (error) {
    console.error('Error in getUserMedicines:', error);
    res.status(500).json({ message: 'Error fetching medicines', error: error.message });
  }
};

// Get a specific medicine by ID
exports.getMedicineById = async (req, res) => {
  try {
    const medicineId = req.params.id;
    const medicine = await Medicine.findOne({
      where: {
        id: medicineId,
        user_id: req.user.id
      }
    });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json(medicine);
  } catch (error) {
    console.error('Error in getMedicineById:', error);
    res.status(500).json({ message: 'Error fetching medicine', error: error.message });
  }
};

// Create a new medicine
exports.createMedicine = async (req, res) => {
  try {
    const { name, dosage, schedule_time, frequency } = req.body;

    // Validate required fields
    if (!name || !dosage || !schedule_time) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        error: 'name, dosage, and schedule_time are required' 
      });
    }

    // Validate frequency if provided
    const validFrequencies = ['daily', 'weekly', 'monthly'];
    if (frequency && !validFrequencies.includes(frequency)) {
      return res.status(400).json({
        message: 'Invalid frequency',
        error: 'Frequency must be one of: daily, weekly, monthly'
      });
    }

    // Get user ID from the authenticated user
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ 
        message: 'Authentication required', 
        error: 'User ID not found in request' 
      });
    }

    const medicine = await Medicine.create({
      name,
      dosage,
      schedule_time,
      frequency: frequency || 'daily',
      user_id: userId,
      active: true
    });

    res.status(201).json({
      message: 'Medicine created successfully',
      medicine
    });
  } catch (error) {
    console.error('Error in createMedicine:', error);
    res.status(400).json({ 
      message: 'Error creating medicine', 
      error: error.message 
    });
  }
};

// Update a medicine
exports.updateMedicine = async (req, res) => {
  try {
    const medicineId = req.params.id;
    const { name, dosage, schedule_time, frequency, active } = req.body;

    const medicine = await Medicine.findOne({
      where: {
        id: medicineId,
        user_id: req.user.id
      }
    });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Update fields if provided
    if (name) medicine.name = name;
    if (dosage) medicine.dosage = dosage;
    if (schedule_time) medicine.schedule_time = schedule_time;
    if (frequency) medicine.frequency = frequency;
    if (typeof active === 'boolean') medicine.active = active;

    await medicine.save();

    res.status(200).json({
      message: 'Medicine updated successfully',
      medicine
    });
  } catch (error) {
    console.error('Error in updateMedicine:', error);
    res.status(400).json({ message: 'Error updating medicine', error: error.message });
  }
};

// Delete a medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const medicineId = req.params.id;
    const medicine = await Medicine.findOne({
      where: {
        id: medicineId,
        user_id: req.user.id
      }
    });

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

// Get medicine schedule
exports.getMedicineSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = req.query.date || new Date().toISOString().split('T')[0];

    const medicines = await Medicine.findAll({
      where: {
        user_id: userId,
        active: true
      }
    });

    res.status(200).json(medicines);
  } catch (error) {
    console.error('Error in getMedicineSchedule:', error);
    res.status(500).json({ message: 'Error fetching schedule', error: error.message });
  }
};

// Acknowledge medicine taken
exports.acknowledgeMedicine = async (req, res) => {
  try {
    const { medicine_id, status = 'taken', notes } = req.body;
    const userId = req.user.id;

    // Verify medicine belongs to user
    const medicine = await Medicine.findOne({
      where: {
        id: medicine_id,
        user_id: userId
      }
    });

    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    const log = await AcknowledgmentLog.create({
      user_id: userId,
      medicine_id,
      status,
      notes,
      scheduled_for: new Date(),
      taken_at: new Date()
    });

    res.status(201).json({
      message: 'Medicine acknowledgment logged successfully',
      log
    });
  } catch (error) {
    console.error('Error in acknowledgeMedicine:', error);
    res.status(400).json({ message: 'Error logging acknowledgment', error: error.message });
  }
};
