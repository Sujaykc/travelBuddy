const { Notification } = require('../models');

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('relatedUserId', 'firstName lastName profileImage');

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (notification && notification.userId.toString() === req.user._id.toString()) {
      notification.isRead = true;
      await notification.save();
      res.json(notification);
    } else {
      res.status(404);
      throw new Error('Notification not found or unauthorized');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead
};
