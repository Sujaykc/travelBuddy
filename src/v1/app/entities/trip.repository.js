const { Trip } = require('../../models');
const TripEntity = require('./trip.entity');

const toEntity = (tripDoc) => TripEntity.fromPersistence(tripDoc);

const create = async (data) => {
  const trip = await Trip.create(data);
  return toEntity(trip);
};

const findByUserId = async (userId) => {
  const trips = await Trip.find({ userId });
  return trips.map(toEntity);
};

const findLatestByUserId = async (userId) => {
  const trip = await Trip.findOne({ userId }).sort({ createdAt: -1 });
  return toEntity(trip);
};

const findById = async (id) => {
  const trip = await Trip.findById(id);
  return toEntity(trip);
};

const findMatchesForTrip = async (trip, userId) => {
  const matches = await Trip.find({
    userId: { $ne: userId },
    destination: trip.destination,
    $and: [
      { startDate: { $lte: trip.endDate } },
      { endDate: { $gte: trip.startDate } }
    ]
  }).populate('userId', 'firstName lastName profileImage');

  return matches.map(toEntity);
};

const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const applyTripEntity = (tripDoc, entity) => {
  if (has(entity, 'destination')) tripDoc.destination = entity.destination;
  if (has(entity, 'startDate')) tripDoc.startDate = entity.startDate;
  if (has(entity, 'endDate')) tripDoc.endDate = entity.endDate;
  if (has(entity, 'description')) tripDoc.description = entity.description;
};

const save = async (entity) => {
  if (!entity || !entity.id) {
    return null;
  }

  const tripDoc = await Trip.findById(entity.id);
  if (!tripDoc) {
    return null;
  }

  applyTripEntity(tripDoc, entity);
  await tripDoc.save();
  return toEntity(tripDoc);
};

const deleteTrip = async (entity) => {
  if (!entity || !entity.id) {
    return;
  }

  await Trip.deleteOne({ _id: entity.id });
};

module.exports = {
  create,
  findByUserId,
  findLatestByUserId,
  findById,
  findMatchesForTrip,
  save,
  delete: deleteTrip
};
