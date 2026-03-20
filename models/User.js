const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    dateOfBirth: { type: Date },
    profileImage: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    socialLoginProvider: { type: String, enum: ['local', 'google', 'apple'], default: 'local' },
    socialLoginId: { type: String },
    refreshToken: { type: String, default: null },
    deviceToken: { type: String, default: null }
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
