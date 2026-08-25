const express = require('express');
const {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require('../../v1/app/controllers/trip/trip.controller');
const { protect } = require('../../middlewares');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createTrip)
  .get(getTrips);

router.route('/:id')
  .get(getTripById)
  .put(updateTrip)
  .delete(deleteTrip);

module.exports = router;
