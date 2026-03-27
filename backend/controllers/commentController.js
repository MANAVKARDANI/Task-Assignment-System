const { Comment } = require("../models");

exports.addComment = async (req, res) => {
  const { task_id, comment } = req.body;

  const newComment = await Comment.create({
    task_id,
    user_id: req.user.id,
    comment,
  });

  res.json(newComment);
};

exports.getComments = async (req, res) => {
  const comments = await Comment.findAll({
    where: { task_id: req.params.taskId },
  });

  res.json(comments);
};