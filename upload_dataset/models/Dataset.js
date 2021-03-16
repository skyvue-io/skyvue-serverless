const Mongoose = require('mongoose');

const Dataset = new Mongoose.Schema(
  {
    userId: String,
    title: String,
    visibilitySettings: {
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