const { createChatUseCases } = require('../../../src/v1/app/usecases/chat');

describe('Chat use cases', () => {
  let deps;
  let useCases;

  beforeEach(() => {
    deps = {
      messageRepository: {
        create: jest.fn(),
        findBetweenUsers: jest.fn()
      },
      connectionRepository: {
        findAcceptedBetween: jest.fn()
      },
      notificationRepository: {
        create: jest.fn()
      }
    };

    useCases = createChatUseCases(deps);
  });

  it('sendMessage rejects when not connected', async () => {
    deps.connectionRepository.findAcceptedBetween.mockResolvedValue(null);

    await expect(
      useCases.sendMessage({ userId: 'user-1', receiverId: 'user-2', content: 'Hi' })
    ).rejects.toMatchObject({ statusCode: 403, code: 'NOT_CONNECTED' });
  });

  it('sendMessage rejects when messaging self', async () => {
    await expect(
      useCases.sendMessage({ userId: 'user-1', receiverId: 'user-1', content: 'Hi' })
    ).rejects.toMatchObject({ statusCode: 400, code: 'INVALID_REQUEST' });
  });

  it('sendMessage creates message and notification', async () => {
    deps.connectionRepository.findAcceptedBetween.mockResolvedValue({ id: 'conn-1' });
    deps.messageRepository.create.mockResolvedValue({ id: 'msg-1' });

    const result = await useCases.sendMessage({
      userId: 'user-1',
      receiverId: 'user-2',
      content: 'Hello'
    });

    expect(deps.messageRepository.create).toHaveBeenCalledWith({
      senderId: 'user-1',
      receiverId: 'user-2',
      content: 'Hello'
    });
    expect(deps.notificationRepository.create).toHaveBeenCalledWith({
      userId: 'user-2',
      type: 'new_message',
      relatedUserId: 'user-1'
    });
    expect(result.message.id).toBe('msg-1');
  });

  it('getHistory returns messages', async () => {
    deps.messageRepository.findBetweenUsers.mockResolvedValue([{ id: 'msg-1' }]);

    const result = await useCases.getHistory({ userId: 'user-1', otherUserId: 'user-2' });

    expect(deps.messageRepository.findBetweenUsers).toHaveBeenCalledWith('user-1', 'user-2');
    expect(result.messages).toHaveLength(1);
  });
});
