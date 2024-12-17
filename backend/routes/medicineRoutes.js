const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const { verifyToken } = require('../middleware/authMiddleware');

// Get all medicines for a user
router.get('/', verifyToken, medicineController.getUserMedicines);

// Get a specific medicine
router.get('/:id', verifyToken, medicineController.getMedicineById);

// Create a new medicine
router.post('/', verifyToken, medicineController.createMedicine);

// Update a medicine
router.put('/:id', verifyToken, medicineController.updateMedicine);

// Delete a medicine
router.delete('/:id', verifyToken, medicineController.deleteMedicine);

// Get medicine schedule
router.get('/schedule', verifyToken, medicineController.getMedicineSchedule);

// Acknowledge medicine taken
router.post('/acknowledge/:id', verifyToken, medicineController.acknowledgeMedicine);

module.exports = router;
