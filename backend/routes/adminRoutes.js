const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Apply authentication and admin check middleware to all routes
router.use(authenticateToken, isAdmin);

// Patient Management
router.get('/patients', adminController.getAllPatients);
router.get('/patients/:id', adminController.getPatientById);
router.put('/patients/:id', adminController.updatePatient);
router.delete('/patients/:id', adminController.deletePatient);

// Medicine Management
router.get('/medicines', adminController.getAllMedicines);
router.post('/medicines', adminController.createMedicine);
router.put('/medicines/:id', adminController.updateMedicine);
router.delete('/medicines/:id', adminController.deleteMedicine);

// Logs Management
router.get('/logs', adminController.getAllLogs);
router.get('/logs/filtered', adminController.getFilteredLogs);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;