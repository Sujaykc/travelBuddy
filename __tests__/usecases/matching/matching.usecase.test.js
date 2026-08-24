const { createMatchingUseCases } = require('../../../src/v1/app/usecases/matching');

describe('Matching use cases', () => {
  let deps;
  let useCases;

  beforeEach(() => {
    deps = {
      tripRepository: {
        findLatestByUserId: jest.fn(),
        findMatchesForTrip: jest.fn()
      }
    };

    useCases = createMatchingUseCases(deps);
  });

  it('returns message when user has no trips', async () => {
    deps.tripRepository.findLatestByUserId.mockResolvedValue(null);

    const result = await useCases.getMatches({ userId: 'user-1' });

    expect(result.message).toContain('Create a trip');
    expect(result.matches).toEqual([]);
  });

  it('returns matches for the first trip', async () => {
    const trip = { id: 'trip-1', destination: 'Paris' };
    deps.tripRepository.findLatestByUserId.mockResolvedValue(trip);
    deps.tripRepository.findMatchesForTrip.mockResolvedValue([{ id: 'match-1' }]);

    const result = await useCases.getMatches({ userId: 'user-1' });

    expect(deps.tripRepository.findMatchesForTrip).toHaveBeenCalledWith(trip, 'user-1');
    expect(result.matches).toHaveLength(1);
  });
});
