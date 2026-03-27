const { Task } = require("../models");
const { createNotification } = require("../utils/notificationHelper");

exports.createTask = async (req, res) => {
  const task = await Task.create(req.body);

  await createNotification(
    task.assigned_to,
    `New task assigned: ${task.title}`
  );

  res.json(task);
};

exports.getTasks = async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
};

exports.getMyTasks = async (req, res) => {
  const tasks = await Task.findAll({
    where: { assigned_to: req.user.id },
  });

  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findByPk(req.params.id);

  await task.update(req.body);

  if (task.status === "completed") {
    await createNotification(
      task.assigned_to,
      `Task completed: ${task.title}`
    );
  }

  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.destroy({ where: { id: req.params.id } });
  res.json({ msg: "Deleted" });
};