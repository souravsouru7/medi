const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// User routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/create-admin', authController.createAdmin);

module.exports = router;
