const mongoose = require('mongoose');
require('dotenv').config();
const dns = require('dns');

// Force Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGO_URI = process.env.MONGO_URI;

console.log('\n--- MongoDB Connection Diagnostic Tool ---');
console.log('Detecting MONGO_URI from .env file...');

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is not defined in your .env file.');
  process.exit(1);
}

// Mask sensitive info for logging
const maskedUri = MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//db_user:********@');
console.log('Target URI:', maskedUri);

console.log('\nAttempting to connect to MongoDB...');

const options = {
  serverSelectionTimeoutMS: 5000, // 5 seconds
};

mongoose.connect(MONGO_URI, options)
  .then(() => {
    console.log('\n✅ SUCCESS: Successfully connected to MongoDB!');
    console.log('Database name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ FAILURE: Could not connect to MongoDB.');
    console.error('Error Code:', err.code || 'N/A');
    console.error('Error Message:', err.message);

    console.log('\n--- Troubleshooting Tips ---');
    if (err.message.includes('querySrv ECONNREFUSED') || err.message.includes('ENOTFOUND')) {
      console.log('1. DNS RESOLUTION FAILED: The cluster hostname in your URI seems invalid.');
      console.log('   Check if "cluster0.2ahlojl.mongodb.net" is correctly typed.');
    } else if (err.message.includes('ETIMEDOUT')) {
      console.log('1. NETWORK TIMEOUT: The server is not responding.');
      console.log('   Check your internet connection and verify Atlas IP Whitelist.');
    } else if (err.message.includes('Authentication failed')) {
      console.log('1. AUTHENTICATION FAILED: Check your username and password in the URI.');
    }
    
    console.log('\n2. Check your MongoDB Atlas Dashboard:');
    console.log('   - Navigate to "Network Access" and ensure "0.0.0.0/0" or your current IP is added.');
    console.log('   - Verify the database user has "Read and write to any database" permissions.');
    
    process.exit(1);
  });
