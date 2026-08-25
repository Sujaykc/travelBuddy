const {
  createMemorySchema,
  updateMemorySchema,
  memoryIdSchema
} = require('../memory.validator');
const {
  fromUserOnly,
  fromIdAndUser,
  fromUserAndPayload,
  fromIdUserAndPayload
} = require('../../common/common-dtos');

module.exports = {
  createMemory: {
    schema: createMemorySchema,
    from: fromUserAndPayload(createMemorySchema)
  },
  updateMemory: {
    schema: updateMemorySchema,
    from: fromIdUserAndPayload(memoryIdSchema, 'memoryId', updateMemorySchema)
  },
  getMemory: {
    from: fromIdAndUser(memoryIdSchema, 'memoryId')
  },
  deleteMemory: {
    from: fromIdAndUser(memoryIdSchema, 'memoryId')
  },
  listMemories: {
    from: fromUserOnly
  }
};
