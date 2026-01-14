const express = require("express");
const { ensureAuthenticaticated } = require("../Middlewares/Auth");
const {
  createArtwork,
  getAllArtwork,
  getUserArtWork,
  deleteArtWork,
  editArtWork,
  toggleLikeArtwork
} = require("../Controllers/ArtworkController");
const upload = require("../Util/upload");

const router = express.Router();

// Multer will handle multipart/form-data for artwork uploads

// CREATE ARTWORK API
router.post("/upload",ensureAuthenticaticated,upload.single("image"),createArtwork);
// GET ALL ARTWORKS (FEED) API
router.get("/explore", ensureAuthenticaticated, getAllArtwork);
// GET USER ARTWORKS API
router.get("/user", ensureAuthenticaticated, getUserArtWork);
// DELETE ARTWORK API
router.delete("/delete/:id", ensureAuthenticaticated, deleteArtWork);
// EDIT ARTWORK API
router.put("/edit/:id",ensureAuthenticaticated,upload.single("image"),editArtWork);
// LIKE AND UNLIKE ARTWORK API
router.post("/:id/like",ensureAuthenticaticated,toggleLikeArtwork);


module.exports = router;
