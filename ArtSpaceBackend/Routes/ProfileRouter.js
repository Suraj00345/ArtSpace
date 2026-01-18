const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  searchUser,
  deleteProfilePhoto,
} = require("../Controllers/ProfileController");
const { ensureAuthenticaticated } = require("../Middlewares/Auth");
const uploadProfile = require("../Util/ProfileUpload");


//Search profile API
router.get("/search",ensureAuthenticaticated,searchUser);

//Get user profile using userid API
router.get("/:userId", ensureAuthenticaticated, getUserProfile);

//Update profile details API
router.put("/updateProfile",ensureAuthenticaticated,uploadProfile.single("profilePhoto"),updateProfile);

//delete user profile photo
router.delete("/deleteProfilePhoto",ensureAuthenticaticated,deleteProfilePhoto);

module.exports = router;
