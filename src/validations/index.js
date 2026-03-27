module.exports = {
  ...require('./auth.validation.js'),
  ...require('./user.validation.js'),
  ...require('./trip.validation.js'),
  ...require('./connection.validation.js'),
  ...require('./message.validation.js'),
  ...require('./memory.validation.js')
};
