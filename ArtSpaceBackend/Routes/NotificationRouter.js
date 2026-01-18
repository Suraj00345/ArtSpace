const express = require("express");
const router = express();
const { ensureAuthenticaticated } = require("../Middlewares/Auth");
const {
  getNotifications,
  markAsRead,
} = require("../Controllers/NotificationController");

//Get all the notification API
router.get("/", ensureAuthenticaticated, getNotifications);

//Mark as read notification API
router.patch("/:id/read", ensureAuthenticaticated, markAsRead);

module.exports = router;
