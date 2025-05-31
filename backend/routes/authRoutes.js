const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const { uploadImage } = require("../controllers/authController");
const router = express.Router();

// Auth Routes
router.post("/register", registerUser); //Register User
router.post("/login", loginUser); //Login User
router.get("/profile", protect, getUserProfile); //Get User Profile
router.put("/profile", protect, updateUserProfile); // Update User Profile
router.post("/upload-image", protect, upload.single("image"), uploadImage);
module.exports = router;
