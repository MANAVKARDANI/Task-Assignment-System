module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Post", {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  });
};

