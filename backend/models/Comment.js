module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Comment", {
    comment: DataTypes.TEXT,
  });
};