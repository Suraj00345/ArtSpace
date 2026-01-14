const Comment = require("../Models/comment");
const ArtWork = require("../Models/artwork");
const createNotification = require("../Util/createNotification");
const emitNotification = require("../Util/emitNotification");
const { getIO } = require("../Util/socket");

//Create Comment
const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const artworkId = req.params.artworkId;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    //ensure artwork exists
    const artwork = await ArtWork.findById(artworkId);
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    const comment = await Comment.create({
      artwork: artworkId,
      user: req.userId,
      text,
    });

    res.status(201).json(comment);

    const notification = await createNotification({
      receiver: artwork.artist,
      sender: req.userId,
      type: "COMMENT",
      post: artwork._id,
    });

    if (notification) {
      await emitNotification(artwork.artist, notification);
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to create comment" });
  }
};

//Get Comments by Artwork
const getArtworkComments = async (req, res) => {
  try {
    const artworkId = req.params.artworkId;
    // console.log(artworkId);
    const comments = await Comment.find({ artwork: artworkId })
      .populate("user", "name profilePhoto")
      .sort({
        createdAt: 1,
      });

    // //emit to post room
    // const io = getIO();
    // io.to(artworkId.toString()).emit("new-comment", comments);

    //send json
    res.json(comments).status(201);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

//Delete Comments by Owner only - for future
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comment = await comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }

    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};

module.exports = {
  createComment,
  getArtworkComments,
  deleteComment,
};
