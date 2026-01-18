const User = require("../Models/User");
const Follow = require("../Models/follow");
const Artwork = require("../Models/artwork");
const cloudinary = require("../Util/cloudinary");

//Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const profileUser = await User.findById(userId);
    // console.log(profileUser);

    if (!profileUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Consistency check: Use the same property name for the logged-in user
    const loggedInUserId = req.user?._id;

    const isMe =
      loggedInUserId &&
      loggedInUserId.toString() === profileUser._id.toString();

    let isFollowing = false;
    if (loggedInUserId && !isMe) {
      // .exists returns a truthy value or null
      const followDoc = await Follow.exists({
        follower: loggedInUserId,
        following: profileUser._id,
      });
      isFollowing = !!followDoc;
    }
    // here we have to ensure the exact name that is mentioned in the schema to
    // find the artwork here it is artist in case of find artwork
    const artworks = await Artwork.find({ artist: profileUser._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      user: {
        _id: profileUser._id,
        name: profileUser.name,
        username: profileUser.username,
        profilePhoto: profileUser.profilePhoto,
        bio: profileUser.bio,
        followersCount: profileUser.followersCount,
        followingCount: profileUser.followingCount,
        usernameChangedAt: profileUser.usernameChangedAt,
        isMe,
        isFollowing,
      },
      artworks,
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Update profile details
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { bio } = req.body;
    const updateData = {};
    // bio update
    if (bio != undefined) {
      if (bio.length > 155) {
        return res.status(400).json({
          message: "Bio must be under 155 character",
        });
      }
      updateData.bio = bio;
    }

    //profile picture upload
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "Profile_Picture",
        resource_type: "image",
      });
      updateData.profilePhoto = uploadResult.secure_url;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Noting to update",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("name profilePhoto bio username");

    // console.log(updatedUser);

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

//Search Profile details
const searchUser = async (req, res) => {
  try {
    // CHANGE THIS LINE:
    const { q } = req.query;
    // console.log("Query received:", q);

    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    const safeQuery = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const users = await User.find({
      $or: [
        { username: { $regex: `^${safeQuery}`, $options: "i" } },
        { name: { $regex: safeQuery, $options: "i" } },
      ],
    })
      .select("username name profilePhoto followersCount")
      .limit(10)
      .lean();

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getUserProfile, updateProfile, searchUser };
