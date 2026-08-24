const { createTripUseCases } = require('../../../src/v1/app/usecases/trip');

describe('Trip use cases', () => {
  let deps;
  let useCases;

  beforeEach(() => {
    deps = {
      tripRepository: {
        create: jest.fn(),
        findByUserId: jest.fn(),
        findById: jest.fn(),
        save: jest.fn(),
        delete: jest.fn()
      }
    };

    useCases = createTripUseCases(deps);
  });

  it('createTrip stores a new trip', async () => {
    const trip = { id: 'trip-1' };
    deps.tripRepository.create.mockResolvedValue(trip);

    const input = {
      userId: 'user-1',
      destination: 'Paris',
      startDate: new Date('2030-01-01'),
      endDate: new Date('2030-01-10'),
      description: 'Trip to Paris'
    };

    const result = await useCases.createTrip(input);

    expect(deps.tripRepository.create).toHaveBeenCalledWith({
      userId: 'user-1',
      destination: 'Paris',
      startDate: input.startDate,
      endDate: input.endDate,
      description: 'Trip to Paris'
    });
    expect(result.trip).toBe(trip);
  });

  it('listTrips returns trips for user', async () => {
    deps.tripRepository.findByUserId.mockResolvedValue([{ id: 'trip-1' }]);

    const result = await useCases.listTrips({ userId: 'user-1' });

    expect(deps.tripRepository.findByUserId).toHaveBeenCalledWith('user-1');
    expect(result.trips).toHaveLength(1);
  });

  it('getTrip rejects when trip is not owned', async () => {
    deps.tripRepository.findById.mockResolvedValue({
      id: 'trip-1',
      userId: 'user-2'
    });

    await expect(
      useCases.getTrip({ userId: 'user-1', tripId: 'trip-1' })
    ).rejects.toMatchObject({ statusCode: 404, code: 'TRIP_NOT_FOUND' });
  });

  it('updateTrip updates fields and saves', async () => {
    const trip = {
      id: 'trip-1',
      userId: 'user-1',
      destination: 'Paris',
      description: 'Old'
    };
    deps.tripRepository.findById.mockResolvedValue(trip);

    const result = await useCases.updateTrip({
      userId: 'user-1',
      tripId: 'trip-1',
      destination: 'Rome',
      description: 'New'
    });

    expect(trip.destination).toBe('Rome');
    expect(trip.description).toBe('New');
    expect(deps.tripRepository.save).toHaveBeenCalledWith(trip);
    expect(result.trip).toBe(trip);
  });

  it('deleteTrip removes trip', async () => {
    const trip = { id: 'trip-1', userId: 'user-1' };
    deps.tripRepository.findById.mockResolvedValue(trip);

    const result = await useCases.deleteTrip({ userId: 'user-1', tripId: 'trip-1' });

    expect(deps.tripRepository.delete).toHaveBeenCalledWith(trip);
    expect(result.message).toBe('Trip removed');
  });
});
