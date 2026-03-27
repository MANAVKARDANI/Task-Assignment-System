require("dotenv").config();
const app = require("./app");
const db = require("./models");

const PORT = process.env.PORT || 5000;

db.sequelize
  .authenticate()
  // In-place schema evolution for this project setup.
  // In a true production environment you would use migrations instead.
  .then(() => db.sequelize.sync({ alter: true }))
  .then(() => {
    console.log("PostgreSQL connected and models synced");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });