const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { register, login, changePassword } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.put("/change-password", auth, changePassword);

module.exports = router;