const { Op } = require("sequelize");
const {
  Task,
  User,
  Comment,
  Notification,
  TaskProgress,
  Profile,
} = require("../models");
const { createNotification } = require("../utils/notificationHelper");

function dateRangeOnly(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function isOverdue(task) {
  if (!task.deadline) return false;
  if (task.status === "completed") return false;
  return new Date() > new Date(task.deadline);
}

async function computeTaskProgress(taskId) {
  const rows = await TaskProgress.findAll({
    where: { task_id: taskId },
    order: [["id", "ASC"]],
  });

  const total = rows.length;
  const completed = rows.filter((r) => r.is_completed).length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  return { rows, total, completed, progress };
}

function serializeTaskBase(task, progressInfo) {
  const overdue = isOverdue(task);
  return {
    ...task.toJSON(),
    progress: progressInfo.progress,
    // UI expects `status` to drive the badge; we compute "overdue" dynamically.
    status: overdue ? "overdue" : task.status,
    keywords: progressInfo.rows.map((r) => ({
      id: r.id,
      keyword: r.keyword,
      is_completed: r.is_completed,
    })),
  };
}

exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assigned_to,
      due_date,
      deadline,
      priority,
      keywords,
      milestones,
    } = req.body;

    if (!title || !assigned_to) {
      return res.status(400).json({ msg: "Task Title and assignee are required" });
    }

    const assignee = await User.findByPk(assigned_to);
    if (!assignee) return res.status(404).json({ msg: "Assigned user not found" });
    if (assignee.role !== "user") {
      return res.status(403).json({ msg: "Can only assign tasks to users" });
    }

    const keywordArray = Array.isArray(keywords)
      ? keywords
      : Array.isArray(milestones)
        ? milestones
        : typeof keywords === "string"
          ? keywords.split(",").map((s) => s.trim()).filter(Boolean)
          : typeof milestones === "string"
            ? milestones.split(",").map((s) => s.trim()).filter(Boolean)
            : [];

    const task = await Task.create({
      title,
      description,
      assigned_to,
      assigned_by: req.user.id,
      assign_date: new Date(),
      // Keep legacy column name `deadline` but accept either due_date or deadline from frontend.
      deadline: due_date || deadline || null,
      priority: priority || "medium",
      status: "pending",
      progress: 0,
    });

    if (keywordArray.length) {
      await TaskProgress.bulkCreate(
        keywordArray.map((k) => ({
          task_id: task.id,
          keyword: k,
          is_completed: false,
        }))
      );
    }

    await createNotification(task.assigned_to, "New Task Assigned", task.id, `New task assigned: ${task.title}`);

    const { rows, progress } = await computeTaskProgress(task.id);

    return res.status(201).json(
      serializeTaskBase(task, { rows, progress, total: rows.length, completed: rows.filter((r) => r.is_completed).length })
    );
  } catch (err) {
    return res.status(500).json({ msg: "Failed to create task" });
  }
};

// Admin + user listing.
exports.getTasks = async (req, res) => {
  try {
    const { q, assignDate, dueDate, limit, status, priority } = req.query;
    const where = {};

    // Role: admin sees all, user sees own.
    if (req.user.role !== "admin") where.assigned_to = req.user.id;

    if (assignDate) {
      const r = dateRangeOnly(assignDate);
      if (r) where.assign_date = { [Op.gte]: r.start, [Op.lt]: r.end };
    }
    if (dueDate) {
      const r = dateRangeOnly(dueDate);
      if (r) where.deadline = { [Op.gte]: r.start, [Op.lt]: r.end };
    }
    if (priority) where.priority = priority;

    const tasks = await Task.findAll({
      where,
      include: [{ model: User, attributes: ["id", "name", "email", "role"] }],
      order: [["createdAt", "DESC"]],
      limit: limit ? Number(limit) : undefined,
    });

    const qTrim = q?.toString().trim();
    const searchedTasks = qTrim
      ? tasks.filter((t) => {
          const titleMatch = (t.title || "").toLowerCase().includes(qTrim.toLowerCase());
          const userMatch =
            (t.User?.name || "").toLowerCase().includes(qTrim.toLowerCase()) ||
            (t.User?.email || "").toLowerCase().includes(qTrim.toLowerCase()) ||
            (t.User?.role || "").toLowerCase().includes(qTrim.toLowerCase());
          return titleMatch || userMatch;
        })
      : tasks;

    // Overdue notifications (notify admins once per overdue task).
    const overdueTasks = searchedTasks.filter((t) => isOverdue(t));
    if (overdueTasks.length) {
      const admins = await User.findAll({ where: { role: "admin" }, attributes: ["id"] });
      if (admins.length) {
        for (const ot of overdueTasks) {
          for (const admin of admins) {
            const exists = await Notification.count({
              where: { user_id: admin.id, type: "Task Overdue", task_id: ot.id },
            });
            if (!exists) {
              await createNotification(
                admin.id,
                "Task Overdue",
                ot.id,
                `Task overdue: ${ot.title}`
              );
            }
          }
        }
      }
    }

    const results = [];
    for (const t of searchedTasks) {
      const progressInfo = await computeTaskProgress(t.id);
      const serialized = serializeTaskBase(t, progressInfo);
      if (status) {
        const s = status.toString().trim();
        if (serialized.status !== s) continue;
      }
      results.push(serialized);
    }

    return res.json(results);
  } catch (err) {
    return res.status(500).json({ msg: "Failed to fetch tasks" });
  }
};

exports.getMyTasks = async (req, res) => {
  return exports.getTasks(req, res);
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["id", "name", "email"] }],
    });
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (req.user.role !== "admin" && task.assigned_to !== req.user.id) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const progressInfo = await computeTaskProgress(task.id);
    const comments = await Comment.findAll({
      where: { task_id: task.id },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    // Build activity timeline (assigned -> progress checkpoints -> comments -> reassignments).
    const timeline = [];
    const assignedAt = task.assign_date || task.createdAt;
    if (assignedAt) {
      timeline.push({
        id: `assigned-${task.id}`,
        type: "assigned",
        title: "Task assigned",
        description: task.assigned_by ? `Assigned by user #${task.assigned_by}` : "Assigned",
        createdAt: assignedAt,
      });
    }

    for (const p of progressInfo.rows || []) {
      if (!p.is_completed) continue;
      timeline.push({
        id: `progress-${p.id}`,
        type: "progress",
        title: "Progress updated",
        description: `Completed: ${p.keyword}`,
        createdAt: p.updatedAt || p.createdAt,
      });
    }

    for (const c of comments || []) {
      timeline.push({
        id: `comment-${c.id}`,
        type: "comment",
        title: "Comment added",
        description: `${c.User?.name || "User"}: ${c.comment}`,
        createdAt: c.createdAt,
      });
    }

    const notificationWhere = {
      task_id: task.id,
      type: "Task Reassigned",
    };
    if (req.user.role !== "admin") notificationWhere.user_id = req.user.id;

    const reassignments = await Notification.findAll({
      where: notificationWhere,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, attributes: ["id", "name"] }],
    });

    for (const n of reassignments || []) {
      timeline.push({
        id: `reassigned-${n.id}`,
        type: "reassigned",
        title: "Task reassigned",
        description: n.message,
        createdAt: n.createdAt,
      });
    }

    timeline.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return res.json({
      ...serializeTaskBase(task, progressInfo),
      comments,
      progressTimeline: progressInfo.rows.map((r) => ({
        keyword: r.keyword,
        is_completed: r.is_completed,
        completedAt: r.updatedAt || r.createdAt,
      })),
      activityTimeline: timeline,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to fetch task" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const beforeAssignedTo = task.assigned_to;
    const nextAssignedTo = req.body.assigned_to ?? task.assigned_to;
    const reassigning = Number(beforeAssignedTo) !== Number(nextAssignedTo);

    if (req.body.assigned_to) {
      const assignee = await User.findByPk(req.body.assigned_to);
      if (!assignee) return res.status(404).json({ msg: "Assigned user not found" });
      if (assignee.role !== "user") return res.status(403).json({ msg: "Can only assign tasks to users" });
    }

    await task.update({
      title: req.body.title ?? task.title,
      description: req.body.description ?? task.description,
      deadline: req.body.due_date ?? req.body.deadline ?? task.deadline,
      priority: req.body.priority ?? task.priority,
      status: req.body.status ?? task.status,
      assigned_to: nextAssignedTo,
    });

    if (reassigning) {
      // Reset progress checkpoints on reassignment.
      await TaskProgress.update(
        { is_completed: false },
        { where: { task_id: task.id } }
      );

      await createNotification(
        beforeAssignedTo,
        "Task Reassigned",
        task.id,
        `Task "${task.title}" was reassigned to another user`
      );
      await createNotification(
        nextAssignedTo,
        "Task Reassigned",
        task.id,
        "You have been assigned task \"" + task.title + "\""
      );
    }

    await createNotification(
      task.assigned_to,
      "Task Updated",
      task.id,
      `Task updated: ${task.title}`
    );

    const progressInfo = await computeTaskProgress(task.id);
    return res.json(serializeTaskBase(task, progressInfo));
  } catch (err) {
    return res.status(500).json({ msg: "Failed to update task" });
  }
};

exports.updateTaskProgress = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    if (req.user.role !== "admin" && task.assigned_to !== req.user.id) {
      return res.status(403).json({ msg: "Access denied" });
    }

    const completedKeywords = Array.isArray(req.body.completedKeywords)
      ? req.body.completedKeywords
      : [];

    if (!completedKeywords.length) {
      return res.status(400).json({ msg: "completedKeywords is required" });
    }

    await TaskProgress.update(
      { is_completed: true },
      {
        where: {
          task_id: task.id,
          keyword: { [Op.in]: completedKeywords },
        },
      }
    );

    const progressInfo = await computeTaskProgress(task.id);

    const nextStatus =
      progressInfo.total > 0 && progressInfo.completed === progressInfo.total
        ? "completed"
        : progressInfo.completed > 0
          ? "in_progress"
          : "pending";

    await task.update({ status: nextStatus, progress: progressInfo.progress });

    await createNotification(
      task.assigned_to,
      "Task Updated",
      task.id,
      `Progress updated: ${task.title} (${progressInfo.progress}%)`
    );

    return res.json({ ...serializeTaskBase(task, progressInfo) });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to update task progress" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ msg: "Task not found" });
    return res.json({ msg: "Deleted" });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to delete task" });
  }
};
