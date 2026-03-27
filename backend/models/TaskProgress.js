module.exports = (sequelize, DataTypes) => {
  return sequelize.define("TaskProgress", {
    task_id: { type: DataTypes.INTEGER, allowNull: false },
    keyword: { type: DataTypes.STRING, allowNull: false },
    is_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
  });
};

