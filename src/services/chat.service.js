const { Message, Connection, Notification } = require('../models');

const sendMessage = async (userId, receiverId, content) => {
  const connection = await Connection.findOne({
    $or: [
      { requesterId: userId, recipientId: receiverId, status: 'accepted' },
      { requesterId: receiverId, recipientId: userId, status: 'accepted' },
    ],
  });

  if (!connection) {
    const error = new Error('Not connected or connection not accepted');
    error.status = 403;
    throw error;
  }

  const message = await Message.create({
    senderId: userId,
    receiverId,
    content,
  });

  await Notification.create({
    userId: receiverId,
    type: 'new_message',
    relatedUserId: userId,
  });

  return message;
};

const getChatHistory = async (userId, otherUserId) => {
  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId },
    ],
  }).sort({ createdAt: 1 });

  return messages;
};

module.exports = {
  sendMessage,
  getChatHistory,
};
