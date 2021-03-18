const Mongoose = require('mongoose');

const Dataset = new Mongoose.Schema(
  {
    isProcessing: {
      type: Boolean,
      default: true,
    },
    userId: String,
    title: String,
    visibilitySettings: {
      isPublic: {
        type: Boolean,
        default: false,
      },
      owner: String,
      editors: [String],
      viewers: [String],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = Dataset;