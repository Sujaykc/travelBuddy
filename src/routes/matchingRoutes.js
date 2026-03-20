const express = require('express');
const { getMatches } = require('../controllers');
const { protect } = require('../middlewares');

const router = express.Router();

router.route('/').get(protect, getMatches);

module.exports = router;
