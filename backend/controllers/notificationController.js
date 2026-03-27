const { Notification } = require("../models");

exports.getNotifications = async (req, res) => {
  const data = await Notification.findAll({
    where: { user_id: req.user.id },
  });

  res.json(data);
};

exports.markAsRead = async (req, res) => {
  const notification = await Notification.findByPk(req.params.id);
  await notification.update({ is_read: true });

  res.json(notification);
};