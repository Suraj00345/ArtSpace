const { getIO } = require("./socket");
const Notification = require("../Models/notification");

const emitNotification = async (receiverId, notification) => {
  const unreadCount = await Notification.countDocuments({
    receiver: receiverId,
    isRead: false,
  });

  const io = getIO();
  io.to(receiverId.toString()).emit("notification", {
    notification,
    unreadCount,
  });
};

module.exports = emitNotification;
