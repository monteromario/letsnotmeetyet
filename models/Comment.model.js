const mongoose = require("mongoose");
const User = require('./User.model');

const commentSchema = new mongoose.Schema({
    profile: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Profile",
        required: "Profile required."
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: "User required."
    },
    text: {
        type: String,
        required: "Text required."
    },
    private: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

commentSchema.virtual('author', {
	ref: 'User',
	localField: 'user',
	foreignField: '_id'
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;