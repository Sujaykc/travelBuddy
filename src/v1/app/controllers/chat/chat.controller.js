const asyncHandler = require('../../../../helpers/asyncHandler');
const { chatUseCases } = require('../../../../app');
const chatDtos = require('./dtos');
const messageMapper = require('./message.mapper');

const sendMessage = asyncHandler(async (req, res) => {
  const input = chatDtos.sendMessage.from(req.user, req.body);
  const result = await chatUseCases.sendMessage(input);
  res.status(201).json(messageMapper.toMessageResponse(result.message));
});

const getChatHistory = asyncHandler(async (req, res) => {
  const input = chatDtos.getHistory.from(req.user, req.params.userId);
  const result = await chatUseCases.getHistory(input);
  res.status(200).json(messageMapper.toMessageListResponse(result.messages));
});

module.exports = {
  sendMessage,
  getChatHistory
};
