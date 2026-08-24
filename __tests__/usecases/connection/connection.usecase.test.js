const { createConnectionUseCases } = require('../../../src/v1/app/usecases/connection');

describe('Connection use cases', () => {
  let deps;
  let useCases;

  beforeEach(() => {
    deps = {
      connectionRepository: {
        findBetween: jest.fn(),
        create: jest.fn(),
        findById: jest.fn(),
        save: jest.fn(),
        findByUserIdPopulated: jest.fn()
      },
      notificationRepository: {
        create: jest.fn()
      }
    };

    useCases = createConnectionUseCases(deps);
  });

  it('sendRequest rejects when sending to self', async () => {
    await expect(
      useCases.sendRequest({ userId: 'user-1', recipientId: 'user-1' })
    ).rejects.toMatchObject({ statusCode: 400, code: 'INVALID_REQUEST' });
  });

  it('sendRequest rejects when connection already exists', async () => {
    deps.connectionRepository.findBetween.mockResolvedValue({ id: 'conn-1' });

    await expect(
      useCases.sendRequest({ userId: 'user-1', recipientId: 'user-2' })
    ).rejects.toMatchObject({ statusCode: 400, code: 'CONNECTION_EXISTS' });
  });

  it('sendRequest creates connection and notification', async () => {
    const connection = { id: 'conn-1' };
    deps.connectionRepository.findBetween.mockResolvedValue(null);
    deps.connectionRepository.create.mockResolvedValue(connection);

    const result = await useCases.sendRequest({ userId: 'user-1', recipientId: 'user-2' });

    expect(deps.notificationRepository.create).toHaveBeenCalledWith({
      userId: 'user-2',
      type: 'connection_request',
      relatedUserId: 'user-1'
    });
    expect(result.connection).toBe(connection);
  });

  it('handleRequest rejects when not authorized', async () => {
    deps.connectionRepository.findById.mockResolvedValue({
      id: 'conn-1',
      recipientId: 'user-2'
    });

    await expect(
      useCases.handleRequest({ userId: 'user-1', connectionId: 'conn-1', action: 'accept' })
    ).rejects.toMatchObject({ statusCode: 401, code: 'UNAUTHORIZED' });
  });

  it('handleRequest rejects invalid action', async () => {
    deps.connectionRepository.findById.mockResolvedValue({
      id: 'conn-1',
      recipientId: 'user-1',
      status: 'pending'
    });

    await expect(
      useCases.handleRequest({ userId: 'user-1', connectionId: 'conn-1', action: 'block' })
    ).rejects.toMatchObject({ statusCode: 400, code: 'INVALID_ACTION' });
  });

  it('handleRequest accepts connection and notifies requester', async () => {
    const connection = {
      id: 'conn-1',
      recipientId: 'user-1',
      requesterId: 'user-2',
      status: 'pending'
    };
    deps.connectionRepository.findById.mockResolvedValue(connection);

    const result = await useCases.handleRequest({
      userId: 'user-1',
      connectionId: 'conn-1',
      action: 'accept'
    });

    expect(connection.status).toBe('accepted');
    expect(deps.connectionRepository.save).toHaveBeenCalledWith(connection);
    expect(deps.notificationRepository.create).toHaveBeenCalledWith({
      userId: 'user-2',
      type: 'request_accepted',
      relatedUserId: 'user-1'
    });
    expect(result.message).toBe('Connection accepted');
  });

  it('handleRequest rejects when request already handled', async () => {
    deps.connectionRepository.findById.mockResolvedValue({
      id: 'conn-1',
      recipientId: 'user-1',
      status: 'accepted'
    });

    await expect(
      useCases.handleRequest({ userId: 'user-1', connectionId: 'conn-1', action: 'accept' })
    ).rejects.toMatchObject({ statusCode: 409, code: 'CONNECTION_ALREADY_HANDLED' });
  });

  it('listConnections returns user connections', async () => {
    deps.connectionRepository.findByUserIdPopulated.mockResolvedValue([{ id: 'conn-1' }]);

    const result = await useCases.listConnections({ userId: 'user-1' });

    expect(deps.connectionRepository.findByUserIdPopulated).toHaveBeenCalledWith('user-1');
    expect(result.connections).toHaveLength(1);
  });
});
