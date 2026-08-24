const express = require('express');
const { getMatches } = require('../../v1/app/controllers/matching/matching.controller');
const { protect } = require('../../middlewares');

const router = express.Router();

router.use(protect);

router.route('/').get(getMatches);

module.exports = router;
