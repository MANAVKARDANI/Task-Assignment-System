const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { getUsers } = require("../controllers/userController");

router.get("/", auth, role("admin"), getUsers);

module.exports = router;