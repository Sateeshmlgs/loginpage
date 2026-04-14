const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

console.log('Testing connection to:', MONGO_URI ? MONGO_URI.replace(/:([^@]+)@/, ':****@') : 'UNDEFINED');

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000 
})
.then(() => {
    console.log('SUCCESS: Connected to MongoDB');
    process.exit(0);
})
.catch((err) => {
    console.error('FAILURE: Could not connect to MongoDB');
    console.error('Error message:', err.message);
    process.exit(1);
});
