const { createNotificationUseCases } = require('../../../src/v1/app/usecases/notification');

describe('Notification use cases', () => {
  let deps;
  let useCases;

  beforeEach(() => {
    deps = {
      notificationRepository: {
        findByUserIdPopulated: jest.fn(),
        findById: jest.fn(),
        save: jest.fn()
      }
    };

    useCases = createNotificationUseCases(deps);
  });

  it('listNotifications returns data', async () => {
    deps.notificationRepository.findByUserIdPopulated.mockResolvedValue([{ id: 'note-1' }]);

    const result = await useCases.listNotifications({ userId: 'user-1' });

    expect(deps.notificationRepository.findByUserIdPopulated).toHaveBeenCalledWith('user-1');
    expect(result.notifications).toHaveLength(1);
  });

  it('markRead rejects when notification not found', async () => {
    deps.notificationRepository.findById.mockResolvedValue(null);

    await expect(
      useCases.markRead({ userId: 'user-1', notificationId: 'note-1' })
    ).rejects.toMatchObject({ statusCode: 404, code: 'NOTIFICATION_NOT_FOUND' });
  });

  it('markRead sets isRead and saves', async () => {
    const notification = { id: 'note-1', userId: 'user-1', isRead: false };
    deps.notificationRepository.findById.mockResolvedValue(notification);

    const result = await useCases.markRead({ userId: 'user-1', notificationId: 'note-1' });

    expect(notification.isRead).toBe(true);
    expect(deps.notificationRepository.save).toHaveBeenCalledWith(notification);
    expect(result.notification).toBe(notification);
  });

  it('markRead skips save when already read', async () => {
    const notification = { id: 'note-1', userId: 'user-1', isRead: true };
    deps.notificationRepository.findById.mockResolvedValue(notification);

    const result = await useCases.markRead({ userId: 'user-1', notificationId: 'note-1' });

    expect(deps.notificationRepository.save).not.toHaveBeenCalled();
    expect(result.notification).toBe(notification);
  });
});
