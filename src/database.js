const mongoose = require('mongoose');
const config = require('./config');   
require('dotenv').config()

const connectDB = async () => {
  try{
    await mongoose.connect(process.env.MONGODB_URL);   
    console.log('MongoDb Connected...');
  } catch{
    console.error(err);
  }
};

module.exports = { connectDB };
