module.exports = {
  ...require('./auth.controller.js'),
  ...require('./user.controller.js'),
  ...require('./trip.controller.js'),
  ...require('./matching.controller.js'),
  ...require('./connection.controller.js'),
  ...require('./chat.controller.js'),
  ...require('./notification.controller.js'),
  ...require('./memory.controller.js')
};
