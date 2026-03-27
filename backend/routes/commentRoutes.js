const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/commentController");

router.post("/", auth, ctrl.addComment);
router.get("/:taskId", auth, ctrl.getComments);

module.exports = router;