const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./User")(sequelize, Sequelize);
db.Task = require("./Task")(sequelize, Sequelize);
db.Comment = require("./Comment")(sequelize, Sequelize);
db.Notification = require("./Notification")(sequelize, Sequelize);
db.Post = require("./Post")(sequelize, Sequelize);
db.Profile = require("./Profile")(sequelize, Sequelize);
db.TaskProgress = require("./TaskProgress")(sequelize, Sequelize);

// Relations
db.User.hasMany(db.Task, { foreignKey: "assigned_to" });
db.Task.belongsTo(db.User, { foreignKey: "assigned_to" });
db.Task.belongsTo(db.User, { foreignKey: "assigned_by" });

db.Task.hasMany(db.Comment, { foreignKey: "task_id" });
db.Comment.belongsTo(db.Task, { foreignKey: "task_id" });
db.User.hasMany(db.Comment, { foreignKey: "user_id" });
db.Comment.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.Notification, { foreignKey: "user_id" });
db.Notification.belongsTo(db.User, { foreignKey: "user_id" });
db.Notification.belongsTo(db.Task, { foreignKey: "task_id" });

db.Post.hasMany(db.User, { foreignKey: "post_id" });
db.User.belongsTo(db.Post, { foreignKey: "post_id" });

db.User.hasOne(db.Profile, { foreignKey: "user_id" });
db.Profile.belongsTo(db.User, { foreignKey: "user_id" });

db.Task.hasMany(db.TaskProgress, { foreignKey: "task_id" });
db.TaskProgress.belongsTo(db.Task, { foreignKey: "task_id" });

module.exports = db;