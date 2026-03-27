const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');

const connectDB = require('./config/db.js');
const { errorHandler, notFound } = require('./middlewares');
const routes = require('./routes');
const logger = require('./utils/logger.js');

// 1. Catch synchronous exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  if(logger) logger.error('Uncaught Exception:', err);
  process.exit(1);
});

dotenv.config();
connectDB();

const app = express();

// 2. Set security HTTP headers
app.use(helmet());

// 3. Rate limiting
const limiter = rateLimit({
  max: 100, // 100 requests per IP
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: 'Too many requests from this IP, please try again in 15 minutes!'
});
app.use('/api', limiter);

app.use(cors());

// 4. Body parser with data limits
app.use(express.json({ limit: '10kb' }));

// 5. Data sanitization against XSS
app.use(xss());

// 6. Prevent parameter pollution
app.use(hpp());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.send('TravelBuddy API is running...');
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const NODE_ENV = process.env.NODE_ENV;
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});

// 7. Prevent unhandled rejections from crashing the server silently
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});
