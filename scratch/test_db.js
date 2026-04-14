const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

const MONGO_URI = process.env.MONGO_URI;

console.log('Testing connection to:', MONGO_URI);

mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000 // 5 seconds timeout
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
