const asyncHandler = require('../../../../helpers/asyncHandler');
const { memoryUseCases } = require('../../../../app');
const memoryDtos = require('./dtos');
const memoryMapper = require('./memory.mapper');

const createMemory = asyncHandler(async (req, res) => {
  const input = memoryDtos.createMemory.from(req.user, req.body);
  const result = await memoryUseCases.createMemory(input);
  res.status(201).json(memoryMapper.toMemoryResponse(result.memory));
});

const getMemories = asyncHandler(async (req, res) => {
  const input = memoryDtos.listMemories.fromUser(req.user);
  const result = await memoryUseCases.listMemories(input);
  res.status(200).json(memoryMapper.toMemoryListResponse(result.memories));
});

const getMemoryById = asyncHandler(async (req, res) => {
  const input = memoryDtos.getMemory.from(req.user, req.params.id);
  const result = await memoryUseCases.getMemory(input);
  res.status(200).json(memoryMapper.toMemoryResponse(result.memory));
});

const updateMemory = asyncHandler(async (req, res) => {
  const input = memoryDtos.updateMemory.from(req.user, req.params.id, req.body);
  const result = await memoryUseCases.updateMemory(input);
  res.status(200).json(memoryMapper.toMemoryResponse(result.memory));
});

const deleteMemory = asyncHandler(async (req, res) => {
  const input = memoryDtos.deleteMemory.from(req.user, req.params.id);
  const result = await memoryUseCases.deleteMemory(input);
  res.status(200).json(result);
});

module.exports = {
  createMemory,
  getMemories,
  getMemoryById,
  updateMemory,
  deleteMemory
};
