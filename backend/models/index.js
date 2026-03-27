const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./User")(sequelize, Sequelize);
db.Task = require("./Task")(sequelize, Sequelize);
db.Comment = require("./Comment")(sequelize, Sequelize);
db.Notification = require("./Notification")(sequelize, Sequelize);

// Relations
db.User.hasMany(db.Task, { foreignKey: "assigned_to" });
db.Task.belongsTo(db.User, { foreignKey: "assigned_to" });

db.Task.hasMany(db.Comment, { foreignKey: "task_id" });
db.Comment.belongsTo(db.Task, { foreignKey: "task_id" });

db.User.hasMany(db.Notification, { foreignKey: "user_id" });

module.exports = db;