require("dotenv").config();
const app = require("./app");
const db = require("./models");

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  console.log("DB Connected");

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});