// Controllers/artworkController.js
const Artwork = require("../Models/artwork");
const Follow = require("../Models/follow");
const cloudinary = require("../Util/cloudinary");
const mongoose = require("mongoose");
const createNotification = require("../Util/createNotification");
const emitNotification = require("../Util/emitNotification");

//create Artwork
const createArtwork = async (req, res) => {
  try {
    const { title, description } = req.body;
    // console.log("meee===>>>>>>>>", req.userId);

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Cloudinary response (already uploaded by multer)
    const imageUrl = req.file.path;
    const publicId = req.file.filename;

    // console.log("response ======>>>", res);

    const artwork = await Artwork.create({
      title,
      description,
      imageUrl,
      imagePublicId: publicId,
      artist: req.userId, // that is came from the user
    });
    // save in MongoDB
    await artwork.save();

    res.status(201).json(artwork);

    const followers = await Follow.find({
      following: req.userId,
    }).select("follower");

    for (let f of followers) {
      const notification = await createNotification({
        receiver: f.follower,
        sender: req.userId,
        type: "NEW_POST",
        post: artwork._id,
      });

      if (notification) {
        await emitNotification(f.follower, notification);
      }
    }
  } catch (error) {
    console.error("Create artwork error:", error);
    res.status(500).json({ message: "Failed to upload artwork" });
  }
};

//get All ArtWork
const getAllArtwork = async (req, res) => {
  try {
    const userId = req.userId;
    // console.log("userId ======>>>>>>",userId);

    const artworks = await Artwork.find()
      .sort({ createdAt: -1 })
      .populate("artist", "name profilePhoto");

    // console.log(artworks);

    const formattedArtworks = artworks.map((art) => ({
      _id: art._id,
      title: art.title,
      description: art.description,
      imageUrl: art.imageUrl,
      artist: art.artist,
      imagePublicId: art.imagePublicId,
      likesCount: art.likes.length,
      liked: userId ? art.likes.includes(userId) : false,
      createdAt: art.createdAt,
    }));

    res.json(formattedArtworks).status(201);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch artworks" });
  }
};

//get user's artwork
const getUserArtWork = async (req, res) => {
  try {
    const artworks = await Artwork.find({ artist: req.user }).sort({
      createdAt: -1,
    });

    res.json(artworks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user artworks" });
  }
};

//delete artwork by the owner of the particular post
const deleteArtWork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    // console.log("the artwork ======>>>>>>>>>",artwork);
    const imagePublicId = artwork.imagePublicId.split("/")[1];
    //delete from the cloudinary also
    await cloudinary.uploader.destroy(`artworks/${imagePublicId}`);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    if (artwork.artist.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await artwork.deleteOne();
    res.json({ message: "Artwork deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

//edit artwork by the owner of the particular post
const editArtWork = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.userId; // from auth middleware

    // 1. Find artwork
    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // 2. Ownership check
    if (artwork.artist.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this artwork" });
    }

    // 3. Optional image upload
    let imageUrl = artwork.imageUrl;

    if (req.file) {
      const uploadRes = await cloudinary.uploader.upload(req.file.path, {
        folder: "artworks",
      });
      imageUrl = uploadRes.secure_url;
    }

    // 4. Update only provided fields
    if (title) artwork.title = title;
    if (description) artwork.description = description;
    artwork.imageUrl = imageUrl;

    await artwork.save();

    res.status(200).json(artwork);
  } catch (error) {
    console.error("Update artwork error:", error);
    res.status(500).json({ message: "Failed to update artwork" });
  }
};

//like and unlike by the user
const toggleLikeArtwork = async (req, res) => {
  try {
    const artworkId = req.params.id; // coming from params
    const userId = req.userId; // coming from JWT middleware

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    const isLiked = artwork.likes.includes(userId);

    if (isLiked) {
      // UNLIKE
      artwork.likes.pull(userId);
    } else {
      // LIKE
      artwork.likes.push(userId);
    }

    await artwork.save();
    
   //send response
    res.status(200).json({
      message: isLiked ? "Artwork unliked" : "Artwork liked",
      likesCount: artwork.likes.length,
      liked: !isLiked,
    });

    const notification = await createNotification({
      receiver: artwork.artist,
      sender: userId,
      type: "LIKE",
      post: artwork._id,
    });

    if (notification) {
      await emitNotification(artwork.artist, notification);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to like artwork" });
  }
};

module.exports = {
  createArtwork,
  getAllArtwork,
  getUserArtWork,
  deleteArtWork,
  editArtWork,
  toggleLikeArtwork,
};
