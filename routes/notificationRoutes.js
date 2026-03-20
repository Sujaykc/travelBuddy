const express = require('express');
const { getNotifications, markAsRead } = require('../controllers');
const { protect } = require('../middlewares');

const router = express.Router();

router.route('/')
  .get(protect, getNotifications);

router.route('/:id/read')
  .put(protect, markAsRead);

module.exports = router;
