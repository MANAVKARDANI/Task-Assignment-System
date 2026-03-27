module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Notification", {
    message: DataTypes.STRING,
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  });
};