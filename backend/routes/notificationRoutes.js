const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/notificationController");

router.get("/", auth, ctrl.getNotifications);
router.put("/:id", auth, ctrl.markAsRead);

module.exports = router;