const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// Prevent duplicate follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model("follow", followSchema);
