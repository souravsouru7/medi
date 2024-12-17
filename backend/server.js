require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const models = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const logRoutes = require('./routes/logRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/admin', adminRoutes);

// Database sync and server start
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Sync database with { alter: true } only in development
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log('Admin Secret:', process.env.ADMIN_SECRET); 
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();
