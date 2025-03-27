require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database connection with retry logic
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => logger.info('MongoDB connected successfully'))
    .catch(err => {
      logger.error(`MongoDB connection error: ${err.message}`);
      logger.info('Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Parking Management System API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.stack}`);
});

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.stack}`);
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('Server and database connections closed');
      process.exit(0);
    });
  });
});
