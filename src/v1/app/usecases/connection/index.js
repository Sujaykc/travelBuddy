const createSendRequestUseCase = require('./send-request.usecase');
const createHandleRequestUseCase = require('./handle-request.usecase');
const createListConnectionsUseCase = require('./list-connections.usecase');

const createConnectionUseCases = (deps) => ({
  sendRequest: createSendRequestUseCase(deps),
  handleRequest: createHandleRequestUseCase(deps),
  listConnections: createListConnectionsUseCase(deps)
});

module.exports = {
  createConnectionUseCases
};

