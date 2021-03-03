const mongoose = require("mongoose");
const User = require("./User.model");

const likeSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    user2: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;