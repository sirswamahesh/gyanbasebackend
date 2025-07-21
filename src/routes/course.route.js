const express = require("express");
const protectRoute = require("../middlewares/auth.middleware");
const { addCourse, allCourse,updateCourse, deleteCourse, getCourseById } = require("../controllers/course.controller");
const upload = require("../lib/multerConfig");


const router = express.Router()

router.get("/", protectRoute ,allCourse)
router.get("/:courseId", protectRoute, getCourseById)
router.post("/", protectRoute,upload.single("courseThumbnail"), addCourse)
router.put("/:courseId", protectRoute,upload.single("courseThumbnail"), updateCourse)
router.delete("/:courseId", protectRoute,deleteCourse)

module.exports = router;