const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // select: false,
  },
  // PUBLIC PROFILE
  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    sparse: true,
  },
  profilePhoto: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    maxLength: 150,
    default: "",
  },
  // SOCIAL COUNTS
  followersCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
  // USER COOLDOWN
  usernameChangedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// // PASSWORD HASHING (POINT #4 — ADDED HERE)
// UserSchema.pre("save", async function (next) {
//   // only hash if password is new or changed
//   if (!this.isModified("password")) return next();

//   try {
//     const saltRounds = 10;
//     this.password = await bcrypt.hash(this.password, saltRounds);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
