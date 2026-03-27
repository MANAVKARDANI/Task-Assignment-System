const { Comment, Task, User } = require("../models");
const { createNotification } = require("../utils/notificationHelper");

exports.addComment = async (req, res) => {
  try {
    const { task_id, comment } = req.body;
    if (!task_id || !comment) {
      return res.status(400).json({ msg: "task_id and comment are required" });
    }

    const task = await Task.findByPk(task_id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (req.user.role !== "admin" && task.assigned_to !== req.user.id) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const newComment = await Comment.create({
      task_id,
      user_id: req.user.id,
      comment,
    });

    // Notify assignee (and admins indirectly through their task list).
    if (task?.assigned_to) {
      await createNotification(
        task.assigned_to,
        "Comment Added",
        task.id,
        `New comment on "${task.title}"`
      );
    }

    return res.status(201).json(newComment);
  } catch (err) {
    return res.status(500).json({ msg: "Failed to add comment" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (req.user.role !== "admin" && task.assigned_to !== req.user.id) {
      return res.status(403).json({ msg: "Access denied" });
    }
    const comments = await Comment.findAll({
      where: { task_id: req.params.taskId },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    return res.json(comments);
  } catch (err) {
    return res.status(500).json({ msg: "Failed to fetch comments" });
  }
};