const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const ctrl = require("../controllers/taskController");

router.post("/", auth, role("admin"), ctrl.createTask);
router.get("/", auth, ctrl.getTasks);
router.get("/my", auth, ctrl.getMyTasks);
router.put("/:id", auth, ctrl.updateTask);
router.delete("/:id", auth, role("admin"), ctrl.deleteTask);

module.exports = router;