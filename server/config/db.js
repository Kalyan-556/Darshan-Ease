const mongoose = require('mongoose');

let isUsingMockDB = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/darshanease';
  try {
    console.log('Attempting to connect to MongoDB...');
    // Set 3 second buffer for local connection attempts
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('MongoDB database connected successfully.');
    isUsingMockDB = false;
  } catch (err) {
    console.warn('------------------------------------------------------------');
    console.warn('WARNING: MongoDB is not running or URI is invalid.');
    console.warn(`Error details: ${err.message}`);
    console.warn('DarshanEase will run in SIMULATED Fallback Database Mode.');
    console.warn('Data will be persisted locally in: server/uploads/mockDb/');
    console.warn('------------------------------------------------------------');
    isUsingMockDB = true;
  }
};

module.exports = {
  connectDB,
  isMockDB: () => isUsingMockDB,
  setMockDB: (status) => { isUsingMockDB = status; }
};
