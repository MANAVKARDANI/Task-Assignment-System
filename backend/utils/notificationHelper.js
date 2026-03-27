const { Notification } = require("../models");

exports.createNotification = async (user_id, message) => {
  return await Notification.create({
    user_id,
    message,
  });
};