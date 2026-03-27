module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Comment", {
    task_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    comment: DataTypes.TEXT,
  });
};