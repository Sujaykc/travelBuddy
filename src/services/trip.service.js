const { Trip } = require('../models');

const createTrip = async (userId, tripData) => {
  const { destination, startDate, endDate, description } = tripData;
  const trip = await Trip.create({
    userId,
    destination,
    startDate,
    endDate,
    description,
  });
  return trip;
};

const getTrips = async (userId) => {
  const trips = await Trip.find({ userId });
  return trips;
};

const getTripById = async (userId, tripId) => {
  const trip = await Trip.findById(tripId);

  if (trip && trip.userId.toString() === userId.toString()) {
    return trip;
  } else {
    const error = new Error('Trip not found or unauthorized');
    error.status = 404;
    throw error;
  }
};

const updateTrip = async (userId, tripId, updateData) => {
  const trip = await Trip.findById(tripId);

  if (trip && trip.userId.toString() === userId.toString()) {
    trip.destination = updateData.destination || trip.destination;
    trip.startDate = updateData.startDate || trip.startDate;
    trip.endDate = updateData.endDate || trip.endDate;
    trip.description = updateData.description || trip.description;

    const updatedTrip = await trip.save();
    return updatedTrip;
  } else {
    const error = new Error('Trip not found or unauthorized');
    error.status = 404;
    throw error;
  }
};

const deleteTrip = async (userId, tripId) => {
  const trip = await Trip.findById(tripId);

  if (trip && trip.userId.toString() === userId.toString()) {
    await trip.deleteOne();
    return { message: 'Trip removed' };
  } else {
    const error = new Error('Trip not found or unauthorized');
    error.status = 404;
    throw error;
  }
};

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};
