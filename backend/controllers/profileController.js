const path = require("path");
const { User, Profile, Post } = require("../models");

function splitName(full) {
  const parts = (full || "").trim().split(/\s+/).filter(Boolean);
  const first_name = parts.slice(0, 1).join(" ");
  const last_name = parts.slice(1).join(" ");
  return { first_name: first_name || null, last_name: last_name || null };
}

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role", "post_id"],
      include: [
        { model: Profile, required: false },
        { model: Post, attributes: ["name"], required: false },
      ],
    });

    if (!user) return res.status(404).json(null);

    const profile = user.Profile ? user.Profile.toJSON() : null;
    return res.json({
      ...(profile || {}),
      post: user.Post?.name || null,
      user_email: user.email,
      user_role: user.role,
    });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to fetch profile" });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { first_name, last_name, full_name, mobile, address, email } = req.body;
    const derived = full_name ? splitName(full_name) : null;

    const payload = {
      first_name: first_name ?? derived?.first_name ?? null,
      last_name: last_name ?? derived?.last_name ?? null,
      full_name: full_name ?? null,
      mobile: mobile ?? null,
      address: address ?? null,
      email: email ?? null,
      image: req.file ? path.basename(req.file.path) : undefined,
    };

    // Keep User table in sync for email + name.
    if (email) {
      const existing = await User.findOne({ where: { email }, attributes: ["id"] });
      if (existing && existing.id !== req.user.id) {
        return res.status(409).json({ msg: "Email already in use" });
      }
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const nextFullName = payload.full_name || user.name;
    await user.update({
      email: email ?? user.email,
      name: nextFullName || user.name,
    });

    const [profile] = await Profile.upsert({
      user_id: req.user.id,
      ...payload,
    });

    // upsert returns [instance] in some sequelize versions; normalize.
    const updated = await Profile.findOne({ where: { user_id: req.user.id } });
    return res.json(updated || profile);
  } catch (err) {
    return res.status(500).json({ msg: "Failed to update profile" });
  }
};

