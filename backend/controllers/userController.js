const { User, Profile, Post, Task, TaskProgress } = require("../models");
const { Op } = require("sequelize");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "user" },
      attributes: ["id", "name", "email", "role", "status", "post_id"],
      include: [
        { model: Profile, attributes: ["mobile"], required: false },
        { model: Post, attributes: ["name"], required: false },
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ msg: "Failed to fetch users" });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      include: [
        { model: Profile, attributes: ["first_name", "last_name", "full_name", "email", "mobile", "address", "image"], required: false },
        { model: Post, attributes: ["name"], required: false },
        { model: Task, attributes: ["id", "title", "description", "deadline", "status", "priority", "progress"], required: false },
      ],
    });

    if (!user || user.role !== "user") return res.status(404).json({ msg: "User not found" });

    // Compute tasks progress based on TaskProgress.
    const tasks = await Task.findAll({
      where: { assigned_to: user.id },
      include: [],
      order: [["createdAt", "DESC"]],
    });

    const tasksWithProgress = [];
    for (const t of tasks) {
      const points = await TaskProgress.findAll({ where: { task_id: t.id } });
      const total = points.length;
      const completed = points.filter((p) => p.is_completed).length;
      const progress = total ? Math.round((completed / total) * 100) : 0;
      tasksWithProgress.push({
        ...t.toJSON(),
        progress,
        status: progress === 100 ? "completed" : t.status,
      });
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        mobile: user.Profile?.mobile || null,
        post: user.Post?.name || null,
      },
      profile: user.Profile || null,
      tasks: tasksWithProgress,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to fetch user details" });
  }
};