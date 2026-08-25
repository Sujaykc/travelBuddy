const createGetHistoryUseCase = ({ messageRepository }) => async (input) => {
  const messages = await messageRepository.findBetweenUsers(input.userId, input.otherUserId);
  return { messages };
};

module.exports = createGetHistoryUseCase;

