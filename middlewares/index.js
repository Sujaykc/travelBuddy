module.exports = {
  ...require('./authMiddleware.js'),
  ...require('./errorMiddleware.js')
};
