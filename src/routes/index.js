const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes.js');
const userRoutes = require('./user.routes.js');
const tripRoutes = require('./trip.routes.js');
const matchingRoutes = require('./matching.routes.js');
const connectionRoutes = require('./connection.routes.js');
const chatRoutes = require('./chat.routes.js');
const notificationRoutes = require('./notification.routes.js');
const memoryRoutes = require('./memory.routes.js');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/matching', matchingRoutes);
router.use('/connections', connectionRoutes);
router.use('/chats', chatRoutes);
router.use('/notifications', notificationRoutes);
router.use('/memories', memoryRoutes);

module.exports = router;
