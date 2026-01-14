const Notification = require("../Models/notification");

const getNotifications = async (req, res) => {
  const notification = await Notification.find({
    receiver: req.userId,
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("sender", "name profilePhoto")
    .populate("post", "_id");

  // console.log(notification);

  res.json(notification);
};

const markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(
    {
      _id: req.params.id,
      receiver: req.userId,
    },
    {
      isRead: true,
    }
  );

  res.json({ message: "Marked as read" });
};

module.exports = { getNotifications, markAsRead };
