const mongoose = require('mongoose');

const connect = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dp_suivi', {
    serverSelectionTimeoutMS: 5000,
  });
  console.log('[MongoDB] Connected');
};

module.exports = { connect };