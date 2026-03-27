const matchingService = require('../services/matching.service.js');

const getMatches = async (req, res, next) => {
  try {
    const result = await matchingService.getMatches(req.user._id);
    res.json(result);
  } catch (error) {
    if (error.status) res.status(error.status);
    next(error);
  }
};

module.exports = { getMatches };
