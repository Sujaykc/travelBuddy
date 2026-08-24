const createSendMessageUseCase = require('./send-message.usecase');
const createGetHistoryUseCase = require('./get-history.usecase');

const createChatUseCases = (deps) => ({
  sendMessage: createSendMessageUseCase(deps),
  getHistory: createGetHistoryUseCase(deps)
});

module.exports = {
  createChatUseCases
};

