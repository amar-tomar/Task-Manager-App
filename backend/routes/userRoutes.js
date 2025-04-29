const express = require("express");
const { adminOnly, protect } = require("../middlewares/authMiddleware");
const {
  getUsers,
  getUserById,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers);        // Get all users (admin only)
router.get("/:id", protect, getUserById);              // Get user by ID (protected)
router.delete("/:id", protect, adminOnly, deleteUser); // Delete user (admin only)

module.exports = router;
