const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const MONGO_URI = 'mongodb://localhost:27017/crud-app';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected!');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
