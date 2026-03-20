module.exports = {
  ...require('./authController.js'),
  ...require('./userController.js'),
  ...require('./tripController.js'),
  ...require('./matchingController.js'),
  ...require('./connectionController.js'),
  ...require('./chatController.js'),
  ...require('./notificationController.js'),
  ...require('./memoryController.js')
};
