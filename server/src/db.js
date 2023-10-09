const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
}

module.exports = connectDB;