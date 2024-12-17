const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { verifyToken } = require('../middleware/authMiddleware');

// Get user's acknowledgment logs
router.get('/', verifyToken, logController.getUserLogs);

// Get logs by date range
router.get('/range', verifyToken, logController.getLogsByDateRange);

// Get specific log details
router.get('/:id', verifyToken, logController.getLogById);

// Create new acknowledgment log
router.post('/', verifyToken, logController.createLog);

// Update log
router.put('/:id', verifyToken, logController.updateLog);

// Delete log
router.delete('/:id', verifyToken, logController.deleteLog);

module.exports = router;
