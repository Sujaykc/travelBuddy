const asyncHandler = require('../../../../helpers/asyncHandler');
const { matchingUseCases } = require('../../../../app');
const matchingDtos = require('./dtos');
const matchingMapper = require('./matching.mapper');

const getMatches = asyncHandler(async (req, res) => {
  const input = matchingDtos.getMatches.fromUser(req.user);
  const result = await matchingUseCases.getMatches(input);
  const response = {
    matches: matchingMapper.toMatchListResponse(result.matches)
  };

  if (result.message) {
    response.message = result.message;
  }

  res.status(200).json(response);
});

module.exports = { getMatches };
