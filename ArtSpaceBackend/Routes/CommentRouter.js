const express = require("express");
const router = express.Router();
const { ensureAuthenticaticated } = require("../Middlewares/Auth");
const {
  createComment,
  getArtworkComments,
  deleteComment,
} = require("../Controllers/CommentController");

//CREATE COMMENT API
router.post("/artworks/:artworkId/comments",ensureAuthenticaticated,createComment);

//GET ARTWORK COMMENT API
router.get("/artworks/:artworkId/comments",ensureAuthenticaticated,getArtworkComments);

//DELETE COMMENT API
router.delete("/comments/:id", ensureAuthenticaticated, deleteComment);

module.exports = router;
