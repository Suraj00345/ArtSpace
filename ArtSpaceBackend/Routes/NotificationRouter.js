const express = require("express");
const router = express();
const { ensureAuthenticaticated } = require("../Middlewares/Auth");
const {
  getNotifications,
  markAsRead,
} = require("../Controllers/NotificationController");

//get all the notification
router.get("/", ensureAuthenticaticated, getNotifications);

//mark as read notification
router.patch("/:id/read", ensureAuthenticaticated, markAsRead);

module.exports = router;
