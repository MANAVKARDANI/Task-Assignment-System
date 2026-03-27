const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const ctrl = require("../controllers/postController");

router.get("/", ctrl.getPosts);
router.post("/", auth, role("admin"), ctrl.createPost);
router.delete("/:id", auth, role("admin"), ctrl.deletePost);

module.exports = router;

