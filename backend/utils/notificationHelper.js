const { Notification } = require("../models");

exports.createNotification = async (user_id, type, task_id, message) => {
  return await Notification.create({
    user_id,
    type: type || "Task Updated",
    task_id: task_id || null,
    message,
  });
};