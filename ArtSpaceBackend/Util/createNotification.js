const Notification = require("../Models/notification");

const createNotification = async ({ receiver, sender, type, post = null }) => {
  if (receiver.toString() === sender.toString()) return null;

  return await Notification.create({
    receiver,
    sender,
    type,
    post,
  });
};

module.exports = createNotification;
