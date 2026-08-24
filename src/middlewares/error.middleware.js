const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const fallbackStatus = res.statusCode === 200 ? 500 : res.statusCode;
  const statusCode = err.statusCode || err.status || fallbackStatus;
  res.status(statusCode);

  const isProduction = process.env.NODE_ENV === 'production';
  const hideDetails = isProduction && statusCode >= 500;
  const message = hideDetails ? 'Internal server error' : err.message || 'Internal server error';

  const response = {
    message
  };

  if (!hideDetails && err.code) {
    response.code = err.code;
  }

  if (!hideDetails && err.details) {
    response.details = err.details;
  }

  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }

  res.json(response);
};

module.exports = { notFound, errorHandler };
