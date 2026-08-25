const createLogoutUseCase = ({ userRepository }) => async (input) => {
  const user = await userRepository.findById(input.userId);

  if (user) {
    user.refreshToken = null;
    await userRepository.save(user);
  }

  return { message: 'Logged out successfully! Session ended.' };
};

module.exports = createLogoutUseCase;

