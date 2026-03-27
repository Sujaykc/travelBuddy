const { Message, Connection, Notification } = require('../models');

const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content } = req.body;

    const connection = await Connection.findOne({
      $or: [
        { requesterId: req.user._id, recipientId: receiverId, status: 'accepted' },
        { requesterId: receiverId, recipientId: req.user._id, status: 'accepted' },
      ],
    });

    if (!connection) {
      res.status(403);
      throw new Error('Not connected or connection not accepted');
    }

    const message = await Message.create({
      senderId: req.user._id,
      receiverId,
      content,
    });

    await Notification.create({
      userId: receiverId,
      type: 'new_message',
      relatedUserId: req.user._id,
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

const getChatHistory = async (req, res, next) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getChatHistory
};
