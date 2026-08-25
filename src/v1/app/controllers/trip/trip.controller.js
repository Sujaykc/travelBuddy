const asyncHandler = require('../../../../helpers/asyncHandler');
const { tripUseCases } = require('../../../../app');
const tripDtos = require('./dtos');
const tripMapper = require('./trip.mapper');

const createTrip = asyncHandler(async (req, res) => {
  const input = tripDtos.createTrip.from(req.user, req.body);
  const result = await tripUseCases.createTrip(input);
  res.status(201).json(tripMapper.toTripResponse(result.trip));
});

const getTrips = asyncHandler(async (req, res) => {
  const input = tripDtos.listTrips.fromUser(req.user);
  const result = await tripUseCases.listTrips(input);
  res.status(200).json(tripMapper.toTripListResponse(result.trips));
});

const getTripById = asyncHandler(async (req, res) => {
  const input = tripDtos.getTrip.from(req.user, req.params.id);
  const result = await tripUseCases.getTrip(input);
  res.status(200).json(tripMapper.toTripResponse(result.trip));
});

const updateTrip = asyncHandler(async (req, res) => {
  const input = tripDtos.updateTrip.from(req.user, req.params.id, req.body);
  const result = await tripUseCases.updateTrip(input);
  res.status(200).json(tripMapper.toTripResponse(result.trip));
});

const deleteTrip = asyncHandler(async (req, res) => {
  const input = tripDtos.deleteTrip.from(req.user, req.params.id);
  const result = await tripUseCases.deleteTrip(input);
  res.status(200).json(result);
});

module.exports = {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip
};
