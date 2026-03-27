module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Notification", {
    message: DataTypes.STRING,
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
    type: { type: DataTypes.STRING, defaultValue: "Task Updated" },
    task_id: { type: DataTypes.INTEGER, allowNull: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
  });
};