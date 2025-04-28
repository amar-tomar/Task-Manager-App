const express = require("express");
const {adminOnly,protect} = require("../middlewares/authMiddleware");

const router = express.Router();

// User Mangement Routes
router.get("/,protect,adminOnly,getUsers");// Get all Users (Admin Only)
router.get("/:id,protect,getUsersBYId");// Get all Users (Admin Only)
router.delete("/:id,protect,adminOnly,deleteUsers");// Get all Users (Admin Only)

module.exports = router;