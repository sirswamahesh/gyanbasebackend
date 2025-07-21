const express = require("express");
const { signup, login, logout, checkAuth, getAllUsers, updateProfile } = require("../controllers/auth.controller");
const protectRoute = require("../middlewares/auth.middleware");
const upload = require("../lib/multerConfig");

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout",logout)
router.put("/update-profile", protectRoute,upload.single("profile"),updateProfile)
router.get("/check", protectRoute,checkAuth)
router.get("/users", protectRoute,getAllUsers)

module.exports = router;