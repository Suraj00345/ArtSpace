const mongoose = require("mongoose");
const Follow = require("../Models/follow");
const User = require("../Models/User");
const createNotification = require("../Util/createNotification");
const emitNotification = require("../Util/emitNotification");

//follow user
const followUser = async (req, res) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.userId;

  if (currentUserId.toString() === targetUserId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Follow.create(
      [{ follower: currentUserId, following: targetUserId }],
      { session }
    );

    await User.findByIdAndUpdate(
      currentUserId,
      { $inc: { followingCount: 1 } },
      { session }
    );

    await User.findByIdAndUpdate(
      targetUserId,
      { $inc: { followersCount: 1 } },
      { session }
    );
    
    res.status(200).json({ message: "Followed Successfully" });

    const notification = await createNotification({
      receiver: targetUserId,
      sender: currentUserId,
      type: "FOLLOW",
    });

    if (notification) {
      emitNotification(targetUserId, notification);
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      return res.status(400).json({ message: "Already following" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

//unfollow user
const unFollowUser = async (req, res) => {
  const targetUserId = req.params.userId;
  const currentUserId = req.userId;

  const follow = await Follow.findOneAndDelete({
    follower: currentUserId,
    following: targetUserId,
  });

  if (!follow) {
    return res.status(400).json({ message: "You are not following this user" });
  }

  await User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: -1 } });
  await User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: -1 } });

  res.status(200).json({ message: "Unfollowed Successfully" });
};

module.exports = { followUser, unFollowUser };
