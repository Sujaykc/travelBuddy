const { Message } = require('../../models');
const MessageEntity = require('./message.entity');

const toEntity = (messageDoc) => MessageEntity.fromPersistence(messageDoc);

const create = async (data) => {
  const message = await Message.create(data);
  return toEntity(message);
};

const findBetweenUsers = async (userId, otherUserId) => {
  const messages = await Message.find({
    $or: [
      { senderId: userId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: userId }
    ]
  }).sort({ createdAt: 1 });

  return messages.map(toEntity);
};

module.exports = {
  create,
  findBetweenUsers
};
