const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    // Validate input
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email is valid
    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create user
    const user = await User.create({
      first_name,
      last_name,
      email,
      password, // Password will be hashed by the model hook
      role: 'user'
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await user.validPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    };

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { first_name, last_name, email, password, adminKey } = req.body;

    // Verify admin key
    if (adminKey !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Invalid admin key' });
    }

    // Validate input
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email is valid
    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create admin user
    const admin = await User.create({
      first_name,
      last_name,
      email,
      password, // Password will be hashed by the model hook
      role: 'admin'
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const adminResponse = {
      id: admin.id,
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      role: admin.role
    };

    res.status(201).json({
      message: 'Admin user created successfully',
      token,
      user: adminResponse
    });
  } catch (error) {
    console.error('Admin creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
