require('dotenv').config();
const dns = require('dns');

// Force Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Database connection and Server Startup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB Atlas');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('CRITICAL ERROR: Failed to start server');
    console.error('Reason:', error.message);
    
    if (error.message.includes('querySrv ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      console.error('\nHINT: This looks like a DNS or connectivity issue with MongoDB Atlas.');
      console.error('1. Check if your MONGO_URI is correct in the .env file.');
      console.error('2. Ensure your current IP address is whitelisted in MongoDB Atlas.');
      console.error('3. Check your internet connection or firewall settings.\n');
    }
    
    // Exit with failure
    process.exit(1);
  }
};

startServer();
