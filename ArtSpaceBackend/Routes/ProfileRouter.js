const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
} = require("../Controllers/ProfileController");
const { ensureAuthenticaticated } = require("../Middlewares/Auth");
const uploadProfile = require("../Util/ProfileUpload");

//get user profile using userid API
router.get("/:userId", ensureAuthenticaticated, getUserProfile);

//update profile details API
router.put("/updateProfile",ensureAuthenticaticated,uploadProfile.single("profilePhoto"),updateProfile);

module.exports = router;
