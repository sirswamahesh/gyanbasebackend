const express = require("express");
const protectRoute = require("../middlewares/auth.middleware");
const { addLevel, getLevelById } = require("../controllers/level.controller");

const router = express.Router();

router.get("/:levelId", protectRoute, getLevelById);
router.post("/:courseId", protectRoute, addLevel);

module.exports = router;
