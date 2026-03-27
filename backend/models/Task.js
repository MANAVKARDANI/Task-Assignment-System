module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Task", {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    // Stored as `deadline` column in DB (existing schema).
    // We treat it as due date across the application logic.
    deadline: DataTypes.DATE,
    assign_date: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.STRING, defaultValue: "pending" },
    progress: { type: DataTypes.INTEGER, defaultValue: 0 },
    priority: { type: DataTypes.STRING, defaultValue: "medium" },

    assigned_to: { type: DataTypes.INTEGER, allowNull: false },
    assigned_by: { type: DataTypes.INTEGER, allowNull: true },

    // Kept for compatibility with earlier UI/API.
    // Admin/user can treat this as "due_date" in response.
  });
};