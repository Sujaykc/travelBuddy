const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    type: { type: String, enum: ['connection_request', 'request_accepted', 'request_rejected', 'new_message'], required: true },
    relatedUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
