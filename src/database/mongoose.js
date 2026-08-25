const mongoose = require('mongoose');
const chalk = require('chalk');
const logger = require('../helpers/logger.js');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is required to connect to MongoDB');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
  logger.info(chalk.green('MongoDB connected successfully'));
};

module.exports = connectDB;
