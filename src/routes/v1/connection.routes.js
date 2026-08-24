const express = require('express');
const {
  sendConnectionRequest,
  handleConnectionRequest,
  getConnections,
} = require('../../v1/app/controllers/connection/connection.controller');
const { protect } = require('../../middlewares');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(sendConnectionRequest)
  .get(getConnections);

router.route('/:id')
  .put(handleConnectionRequest);

module.exports = router;
