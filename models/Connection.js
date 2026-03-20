const mongoose = require('mongoose');

const connectionSchema = mongoose.Schema(
  {
    requesterId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

const Connection = mongoose.model('Connection', connectionSchema);

module.exports = Connection;
