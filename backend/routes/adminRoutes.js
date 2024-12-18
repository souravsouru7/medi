const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// Apply authentication and admin check middleware to all routes
router.use(authenticateToken, isAdmin);

// Patient Management
router.get('/patients', adminController.getAllPatients);


// Medicine Management
router.get('/medicines', adminController.getAllMedicines);


// Logs Management
router.get('/logs', adminController.getAllLogs);
router.get('/logs/filtered', adminController.getFilteredLogs);

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

module.exports = router;