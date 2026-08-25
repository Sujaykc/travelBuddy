class UserEntity {
  constructor({
    id,
    firstName,
    lastName,
    email,
    isVerified,
    profileImage,
    dateOfBirth,
    password,
    socialLoginProvider,
    socialLoginId,
    emailOtpCode,
    emailOtpExpiresAt,
    passwordResetOtpCode,
    passwordResetOtpExpiresAt,
    refreshToken,
    deviceToken,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.isVerified = isVerified;
    this.profileImage = profileImage;
    this.dateOfBirth = dateOfBirth;
    this.password = password;
    this.socialLoginProvider = socialLoginProvider;
    this.socialLoginId = socialLoginId;
    this.emailOtpCode = emailOtpCode;
    this.emailOtpExpiresAt = emailOtpExpiresAt;
    this.passwordResetOtpCode = passwordResetOtpCode;
    this.passwordResetOtpExpiresAt = passwordResetOtpExpiresAt;
    this.refreshToken = refreshToken;
    this.deviceToken = deviceToken;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPersistence(userDoc) {
    if (!userDoc) {
      return null;
    }

    return new UserEntity({
      id: userDoc.id || (userDoc._id ? userDoc._id.toString() : null),
      firstName: userDoc.firstName || '',
      lastName: userDoc.lastName || '',
      email: userDoc.email || '',
      isVerified: Boolean(userDoc.isVerified),
      profileImage: userDoc.profileImage || '',
      dateOfBirth: userDoc.dateOfBirth || null,
      password: userDoc.password || null,
      socialLoginProvider: userDoc.socialLoginProvider || null,
      socialLoginId: userDoc.socialLoginId || null,
      emailOtpCode: userDoc.emailOtpCode || null,
      emailOtpExpiresAt: userDoc.emailOtpExpiresAt || null,
      passwordResetOtpCode: userDoc.passwordResetOtpCode || null,
      passwordResetOtpExpiresAt: userDoc.passwordResetOtpExpiresAt || null,
      refreshToken: userDoc.refreshToken || null,
      deviceToken: userDoc.deviceToken || null,
      createdAt: userDoc.createdAt || null,
      updatedAt: userDoc.updatedAt || null
    });
  }
}

module.exports = UserEntity;
