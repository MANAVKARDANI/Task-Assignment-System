const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const { getUsers, getUserDetails, createUser } = require("../controllers/userController");

router.post("/create", auth, role("admin"), createUser);
router.get("/", auth, role("admin"), getUsers);
router.get("/:id", auth, role("admin"), getUserDetails);

module.exports = router;