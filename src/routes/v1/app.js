const express = require('express');

const userRoutes = require('./user.routes');
const tripRoutes = require('./trip.routes');
const matchingRoutes = require('./matching.routes');
const connectionRoutes = require('./connection.routes');
const chatRoutes = require('./chat.routes');
const notificationRoutes = require('./notification.routes');
const memoryRoutes = require('./memory.routes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/matching', matchingRoutes);
router.use('/connections', connectionRoutes);
router.use('/chats', chatRoutes);
router.use('/notifications', notificationRoutes);
router.use('/memories', memoryRoutes);

module.exports = router;
