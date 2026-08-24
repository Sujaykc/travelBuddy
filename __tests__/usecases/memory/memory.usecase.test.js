const { createMemoryUseCases } = require('../../../src/v1/app/usecases/memory');

describe('Memory use cases', () => {
  let deps;
  let useCases;

  beforeEach(() => {
    deps = {
      memoryRepository: {
        create: jest.fn(),
        findByUserId: jest.fn(),
        findById: jest.fn(),
        save: jest.fn(),
        delete: jest.fn()
      }
    };

    useCases = createMemoryUseCases(deps);
  });

  it('createMemory stores a memory', async () => {
    const memory = { id: 'mem-1' };
    deps.memoryRepository.create.mockResolvedValue(memory);

    const input = {
      userId: 'user-1',
      tripDate: new Date('2030-01-01'),
      place: 'Paris',
      images: ['https://img.test/1'],
      description: 'Great trip'
    };

    const result = await useCases.createMemory(input);

    expect(deps.memoryRepository.create).toHaveBeenCalledWith({
      userId: 'user-1',
      tripDate: input.tripDate,
      place: 'Paris',
      images: ['https://img.test/1'],
      description: 'Great trip'
    });
    expect(result.memory).toBe(memory);
  });

  it('listMemories returns memories', async () => {
    deps.memoryRepository.findByUserId.mockResolvedValue([{ id: 'mem-1' }]);

    const result = await useCases.listMemories({ userId: 'user-1' });

    expect(deps.memoryRepository.findByUserId).toHaveBeenCalledWith('user-1');
    expect(result.memories).toHaveLength(1);
  });

  it('getMemory rejects when not owned', async () => {
    deps.memoryRepository.findById.mockResolvedValue({
      id: 'mem-1',
      userId: 'user-2'
    });

    await expect(
      useCases.getMemory({ userId: 'user-1', memoryId: 'mem-1' })
    ).rejects.toMatchObject({ statusCode: 404, code: 'MEMORY_NOT_FOUND' });
  });

  it('updateMemory updates fields and saves', async () => {
    const memory = {
      id: 'mem-1',
      userId: 'user-1',
      place: 'Old'
    };
    deps.memoryRepository.findById.mockResolvedValue(memory);

    const result = await useCases.updateMemory({
      userId: 'user-1',
      memoryId: 'mem-1',
      place: 'New',
      images: ['https://img.test/2']
    });

    expect(memory.place).toBe('New');
    expect(memory.images).toEqual(['https://img.test/2']);
    expect(deps.memoryRepository.save).toHaveBeenCalledWith(memory);
    expect(result.memory).toBe(memory);
  });

  it('deleteMemory removes memory', async () => {
    const memory = { id: 'mem-1', userId: 'user-1' };
    deps.memoryRepository.findById.mockResolvedValue(memory);

    const result = await useCases.deleteMemory({ userId: 'user-1', memoryId: 'mem-1' });

    expect(deps.memoryRepository.delete).toHaveBeenCalledWith(memory);
    expect(result.message).toBe('Memory removed');
  });
});
