const express = require("express");
const protectRoute = require("../middlewares/auth.middleware");
const {
  addLecture,
  updateLecture,
  deleteLecture,
  getLectureById,
} = require("../controllers/lecture.controller");
const upload = require("../lib/multerConfig");

const router = express.Router();

router.get("/:lectureId", protectRoute, getLectureById);
router.post("/:levelId", protectRoute, addLecture);
router.put("/:lectureId", protectRoute, upload.single("video"), updateLecture);
router.delete("/:lectureId", protectRoute, deleteLecture);

module.exports = router;
