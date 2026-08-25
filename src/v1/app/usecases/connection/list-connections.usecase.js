const createListConnectionsUseCase = ({ connectionRepository }) => async (input) => {
  const connections = await connectionRepository.findByUserIdPopulated(input.userId);
  return { connections };
};

module.exports = createListConnectionsUseCase;

