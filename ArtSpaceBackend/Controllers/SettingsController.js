const User = require("../Models/User");
const Artwork = require("../Models/artwork");
const Comment = require("../Models/comment");
const Follow = require("../Models/follow");
const Notification = require("../Models/notification");
const cloudinary = require("../Util/cloudinary");
const bcrypt = require("bcrypt");

//change Username
const changeUsername = async (req, res) => {
  const COOLDOWN_DAYS = 14;
  try {
    const userId = req.userId;
    const { username } = req.body; // Matching the "newUsername" key from your frontend
    const newUsername = username;
    // Basic Validation
    if (!newUsername || newUsername.trim().length < 3) {
      return res
        .status(400)
        .json({ message: "Username must be at least 3 characters" });
    }

    const formattedUserName = newUsername.trim();

    // Find User
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if same as current
    if (currentUser.username === formattedUserName) {
      return res
        .status(400)
        .json({ message: "This is already your current username" });
    }

    // 14-day Cooldown Logic
    if (currentUser.usernameChangedAt) {
      const now = new Date();
      const lastChanged = new Date(currentUser.usernameChangedAt);

      const diffInMs = now - lastChanged;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays < COOLDOWN_DAYS) {
        const daysLeft = Math.ceil(COOLDOWN_DAYS - diffInDays);
        return res.status(403).json({
          message: `Cooldown active. You can change it again in ${daysLeft} day(s).`,
        });
      }
    }

    // Check Availability (Ensure no one else has it)
    const isTaken = await User.findOne({ username: formattedUserName });
    if (isTaken) {
      return res
        .status(409)
        .json({ message: "Username already taken by another user" });
    }

    // Update and SET NEW TIMESTAMP
    currentUser.username = formattedUserName;
    currentUser.usernameChangedAt = new Date(); // Start the 14-day timer now

    await currentUser.save();

    res.json({
      message: "Username updated successfully",
      username: formattedUserName,
    });
  } catch (error) {
    console.error("Change Username Error:", error);
    res.status(500).json({ message: "Server error during username update" });
  }
};

//change Password
const changePassoword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    //if any of the field is not field
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }
    //if current password is equal to new password
    if (currentPassword === newPassword) {
      return res
        .status(400)
        .json({ message: "New password must be different" });
    }
    // get user WITH password
    const user = await User.findById(userId).select("+password");
    //check isMatch is return true or false
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    //if check isMatch is false the return error message
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    //assign user password as new password
    user.password = newPassword;

    // save the update in the db
    await user.save();

    res.json({
      message: "Username updated successfully",
      password: newPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password" });
  }
};

//delete account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { password } = req.body;

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password incorrect" });
    }

    // Remove profile photo
    if (user.profilePhoto) {
      const publicId = user.profilePhoto.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`profile/${publicId}`);
    }

    // Remove artworks + images
    const artworks = await Artwork.find({ artist: userId });
    for (const art of artworks) {
      const artPublicId = art.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`artworks/${artPublicId}`);
    }

    await Artwork.deleteMany({ artist: userId });
    await Comment.deleteMany({ user: userId });
    await Follow.deleteMany({
      $or: [{ follower: userId }, { following: userId }],
    });
    await Notification.deleteMany({ receiver: userId });

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted permanently",
    });
  } catch (error) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { changeUsername, changePassoword, deleteAccount };
