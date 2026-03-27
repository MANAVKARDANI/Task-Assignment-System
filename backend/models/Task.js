module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Task", {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    deadline: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed"),
      defaultValue: "pending",
    },
    progress: { type: DataTypes.INTEGER, defaultValue: 0 },
    priority: DataTypes.ENUM("low", "medium", "high"),
  });
};