const express = require("express");
const router = express.Router();
const { ensureAuthenticaticated } = require("../Middlewares/Auth");
const { followUser, unFollowUser } = require("../Controllers/FollowController");

//follow user API
router.post("/follow/:userId", ensureAuthenticaticated, followUser);

//unfollow user API
router.post("/unfollow/:userId", ensureAuthenticaticated, unFollowUser);

module.exports = router;
