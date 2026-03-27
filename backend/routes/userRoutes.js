const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { getUsers, getUserDetails } = require("../controllers/userController");

router.get("/", auth, role("admin"), getUsers);
router.get("/:id", auth, role("admin"), getUserDetails);

module.exports = router;