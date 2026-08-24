const asyncHandler = require('../../../../helpers/asyncHandler');
const { connectionUseCases } = require('../../../../app');
const connectionDtos = require('./dtos');
const connectionMapper = require('./connection.mapper');

const sendConnectionRequest = asyncHandler(async (req, res) => {
  const input = connectionDtos.sendRequest.from(req.user, req.body);
  const result = await connectionUseCases.sendRequest(input);
  res.status(201).json(connectionMapper.toConnectionResponse(result.connection));
});

const handleConnectionRequest = asyncHandler(async (req, res) => {
  const input = connectionDtos.handleRequest.from(req.user, req.params.id, req.body);
  const result = await connectionUseCases.handleRequest(input);
  res.status(200).json({
    message: result.message,
    connection: connectionMapper.toConnectionResponse(result.connection)
  });
});

const getConnections = asyncHandler(async (req, res) => {
  const input = connectionDtos.listConnections.fromUser(req.user);
  const result = await connectionUseCases.listConnections(input);
  res.status(200).json(connectionMapper.toConnectionListResponse(result.connections));
});

module.exports = {
  sendConnectionRequest,
  handleConnectionRequest,
  getConnections
};
