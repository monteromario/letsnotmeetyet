const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
const SALT_ROUNDS = 10;
const Likes = require("./Match.model");
const Comment = require("./Comment.model")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: "Username required.",
    unique: true,
    lowercase: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: "First name required.",
    trim: true,
  },
  lastName: {
    type: String,
    required: "Surname required.",
    trim: true,
  },
  email: {
    type: String,
    required: "E-mail required.",
    unique: true,
    lowercase: true,
    match: [EMAIL_PATTERN, "Invalid e-mail."],
    trim: true,
  },
  password: {
    type: String,
    required: "Password required.",
    match: [
      PASSWORD_PATTERN,
      "Password must have 1 number, 1 uppercase, 1 lowercase and 8 characters.",
    ],
  },
  active: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: 'Gender required.'
  },
  aboutMe: {
    type: String
  },
  preferences: {
    type: String,
    enum: ['Male', 'Female', 'All'],
    required: 'Preference required.'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  profilePictures: {
    type: [String],
    default: ['https://res.cloudinary.com/letsnotmeetyet/image/upload/v1614195193/letsnotmeetyet/pictures/unknown_user_ia1je9.png'],
  },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER'
  },
  social: {
    google: String,
    facebook: String
  },
  activationToken: {
    type: String,
    default: () => {
      return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
      );
    },
  },
  liked: {
    type: [String]
  },
  matches: {
    type: [String]
  },
},
{
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

userSchema.pre("save", function (next) {
  if (this.email === process.env.ADMIN_EMAIL) {
    this.role = 'ADMIN'
  }

  if (this.isModified("password")) {
    bcrypt.hash(this.password, SALT_ROUNDS).then((hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

userSchema.statics.hashPassword = function (passwordToHash) {
    return bcrypt.hash(passwordToHash, SALT_ROUNDS);
};

userSchema.index({ location: '2dsphere' });

userSchema.virtual('likes', {
  ref: 'Likes',
  localField: '_id',
  foreignField: 'user'
});

userSchema.virtual('comments', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'profile'
});

userSchema.virtual('like_user', {
	ref: 'LikeUser',
	localField: 'likes',
	foreignField: '_id'
});

userSchema.virtual('matches_user', {
	ref: 'MatchUser',
	localField: 'matches',
	foreignField: '_id'
});

const User = mongoose.model("User", userSchema);
module.exports = User;