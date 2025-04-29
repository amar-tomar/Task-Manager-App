require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
const reportrouter = require("./routes/reportRoutes");

const app = express();
// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect DataBase
connectDB();
// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/reports", reportrouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server Running on port ${PORT}!`));
