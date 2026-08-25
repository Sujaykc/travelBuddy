const createGetMatchesUseCase = require('./get-matches.usecase');

const createMatchingUseCases = (deps) => ({
  getMatches: createGetMatchesUseCase(deps)
});

module.exports = {
  createMatchingUseCases
};

