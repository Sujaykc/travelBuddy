const express = require('express');
const validateHeaders = require('../../middlewares/validateHeaders');
const { requireAppApiKey } = require('../../middlewares/apiRequest');
const authRoutes = require('./authentication');
const appRoutes = require('./app');

const router = express.Router();

router.use(validateHeaders);
router.use(requireAppApiKey);

router.use('/app/auth', authRoutes);
router.use('/app', appRoutes);

module.exports = router;
