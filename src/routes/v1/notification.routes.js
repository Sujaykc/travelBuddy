const express = require('express');
const { getNotifications, markAsRead } = require('../../v1/app/controllers/notification/notification.controller');
const { protect } = require('../../middlewares');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotifications);

router.route('/:id/read')
  .put(markAsRead);

module.exports = router;
