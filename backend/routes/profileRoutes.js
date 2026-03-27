const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const ctrl = require("../controllers/profileController");

router.get("/me", auth, ctrl.getMe);
router.put("/me", auth, upload.single("image"), ctrl.updateMe);

module.exports = router;

