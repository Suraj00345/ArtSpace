const express = require("express");
const router = express.Router();
const { ensureAuthenticaticated } = require("../Middlewares/Auth");
const { followUser, unFollowUser } = require("../Controllers/FollowController");

//Follow user API
router.post("/follow/:userId", ensureAuthenticaticated, followUser);

//Unfollow user API
router.post("/unfollow/:userId", ensureAuthenticaticated, unFollowUser);

module.exports = router;
