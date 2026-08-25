const createGetProfileUseCase = require('./get-profile.usecase');
const createUpdateProfileUseCase = require('./update-profile.usecase');

const createUserUseCases = (deps) => ({
  getProfile: createGetProfileUseCase(deps),
  updateProfile: createUpdateProfileUseCase(deps)
});

module.exports = {
  createUserUseCases
};

