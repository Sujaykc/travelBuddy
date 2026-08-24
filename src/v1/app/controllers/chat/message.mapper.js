const MessageEntity = require('../../entities/message.entity');

const toMessageResponse = (messageDoc) => {
  const message = MessageEntity.fromPersistence(messageDoc);

  return {
    _id: message ? message.id : null,
    senderId: message ? message.senderId : null,
    receiverId: message ? message.receiverId : null,
    content: message ? message.content : '',
    createdAt: message ? message.createdAt : null,
    updatedAt: message ? message.updatedAt : null
  };
};

const toMessageListResponse = (messages) =>
  Array.isArray(messages) ? messages.map(toMessageResponse) : [];

module.exports = {
  toMessageResponse,
  toMessageListResponse
};
