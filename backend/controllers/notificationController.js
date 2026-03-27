const { Notification } = require("../models");

exports.getNotifications = async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 3;
    const data = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
      ...(limit ? { limit } : {}),
    });

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ msg: "Failed to fetch notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ msg: "Notification not found" });
    if (notification.user_id !== req.user.id) {
      return res.status(403).json({ msg: "Access denied" });
    }

    await notification.update({ is_read: true });
    return res.json(notification);
  } catch (err) {
    return res.status(500).json({ msg: "Failed to update notification" });
  }
};