const mongoose = require("mongoose");
const User = require("./User.model");

const matchSchema = new mongoose.Schema(
  {
    liker: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    liked: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
