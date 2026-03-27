const { Post } = require("../models");

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({ order: [["name", "ASC"]] });
    return res.json(posts);
  } catch (err) {
    return res.status(500).json({ msg: "Failed to fetch posts" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: "Post name is required" });

    const existing = await Post.findOne({ where: { name } });
    if (existing) return res.status(409).json({ msg: "Post already exists" });

    const post = await Post.create({ name });
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ msg: "Failed to create post" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const deleted = await Post.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ msg: "Post not found" });
    return res.json({ msg: "Deleted" });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to delete post" });
  }
};

