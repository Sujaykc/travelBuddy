const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes.js');
const userRoutes = require('./userRoutes.js');
const tripRoutes = require('./tripRoutes.js');
const matchingRoutes = require('./matchingRoutes.js');
const connectionRoutes = require('./connectionRoutes.js');
const chatRoutes = require('./chatRoutes.js');
const notificationRoutes = require('./notificationRoutes.js');
const memoryRoutes = require('./memoryRoutes.js');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/trips', tripRoutes);
router.use('/matching', matchingRoutes);
router.use('/connections', connectionRoutes);
router.use('/chats', chatRoutes);
router.use('/notifications', notificationRoutes);
router.use('/memories', memoryRoutes);

module.exports = router;
