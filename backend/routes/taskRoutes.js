const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getDashboardData, getUserDashboardData, getTasks, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist, getTaskById } = require("../controllers/taskController");

const router = express.Router();

// Task Management Rourtes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks);
router.get("/:id", protect,getTaskById);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskChecklist);

module.exports = router;
