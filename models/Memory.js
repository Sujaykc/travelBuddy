const mongoose = require('mongoose');

const memorySchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    tripDate: { type: Date, required: true },
    place: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String },
  },
  { timestamps: true }
);

const Memory = mongoose.model('Memory', memorySchema);

module.exports = Memory;
