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
router.post('/register', upload.single('profileImage'), registerUser);//Register User
router.post("/login", loginUser); //Login User
router.get("/getuserprofile", protect, getUserProfile); //Get User Profile
router.put("/updateuserprofile", protect, updateUserProfile); // Update User Profile

module.exports = router;
