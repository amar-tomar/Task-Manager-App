const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @desc Get all Tasks (Admin: all , User:Only assigned tasks )
// @route GET /api/tasks/
// @access Private

const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    }
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find(filter).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        "assignedTo",
        "name email profileImageUrl"
      );
    }
    // Add completed todochecklist count to each task
    task = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );
    // Status summary counts
    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id }
    );
    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    const inProgressTasks = await Task.countDocuments({
      ...filter,
      status: "In Progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    res.json({
      tasks,
      statusSummary: {
        all: allTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Get task by ID
// @route GET /api/task/:id
// @access Private

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params._id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
    if (!task) return res.status(400).json({ message: "Task Not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Create a new Task (Admin Only)
// @route Post /api/task/
// @access Private (Admin Only)

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    } = req.body;
    if (!Array.isArray(assignedTo)) {
      return res
        .status(400)
        .json({ message: "assignedTo must be an array of user IDs" });
    }
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      attachments,
      todoChecklist,
    });
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// @desc Update Task details
// @route Put /api/task/:id
// @access Private (Admin Only)

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.priority = req.body.priority || task.priority;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
    task.attachments = req.body.attachments || task.attachments;
    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res
          .status(400)
          .json({ message: "assignTo must be an array of user IDs" });
      }
      task.assignedTo = req.body.assignedTo;
    }
    const updateTask = await task.save();
    res.json({ message: "Task updated successfully", updateTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Delete a Task (Admin Only)
// @route Delete /api/task/:id
// @access Private (Admin Only)

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update Task Status
// @route Put /api/task/:id/status
// @access Private (Admin Only)

const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not Authorized" });
    }
    task.status = req.body.status || task.status;

    if (task.status === "Completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }
    await task.save();
    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update Task Checklist
// @route Put /api/task/:id/todo
// @access Private (Admin Only)

const updateTaskChecklist = async (req, res) => {
  try {
    const { todoChecklist } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update cheklist" });
    }

    task.todoChecklist = todoChecklist; // Replace with udpatedchecklist
    // Auto-update progress based on checklist completion
    const completedCount = task.todoChecklist.filter((item) => {
      item.completed;
    }).length;
    const totalItems = task.todoChecklist.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    // Auto-mark tasj as completed if all items are checked
    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In Progress";
    } else {
      task.status = "Pending";
    }
    await task.save();
    const updatedTask = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// @desc Dashboard Data (user-specific)
// @route Get /api/task/dashboard-data
// @access Private (Admin Only)

const getUserDashboardData = async (req, res) => {
  try {
    console.log("i am working");
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// @desc Dashboard Data (Admin Only)
// @route Get /api/task/dashboard-data
// @access Private (Admin Only)

const getDashboardData = async (req, res) => {
  try {
    // Set base filter depending on the user's role
    const baseFilter = req.user.role === "admin" ? {} : { assignedTo: req.user._id };

    // Helper function to handle aggregation with dynamic filter
    const getCount = async (filter) => {
      return await Task.countDocuments(filter);
    };

    // Helper function to handle aggregation for status distribution
    const getStatusDistribution = async (filter) => {
      const rawStatus = await Task.aggregate([
        { $match: filter },
        { $project: { status: { $toLower: { $trim: { input: "$status" } } } } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
      const statusDistribution = { pending: 0, "in progress": 0, completed: 0 };
      rawStatus.forEach(({ _id, count }) => {
        if (statusDistribution[_id] !== undefined) {
          statusDistribution[_id] = count;
        }
      });
      return statusDistribution;
    };

    // Helper function to handle priority distribution
    const getPriorityDistribution = async (filter) => {
      const rawPrio = await Task.aggregate([
        { $match: filter },
        { $group: { _id: "$priority", count: { $sum: 1 } } }
      ]);
      const priorityDistribution = ["Low", "Medium", "High"].reduce((acc, level) => {
        const found = rawPrio.find((i) => i._id === level);
        acc[level] = found ? found.count : 0;
        return acc;
      }, {});
      return priorityDistribution;
    };

    // Counts: total tasks and overdue tasks
    const [totalTasks, overdueTasks] = await Promise.all([
      getCount(baseFilter),
      getCount({
        ...baseFilter,
        status: { $ne: "Completed" },
        dueDate: { $lt: new Date() }
      })
    ]);

    // Aggregation for status and priority distribution
    const [statusDistribution, priorityDistribution] = await Promise.all([
      getStatusDistribution(baseFilter),
      getPriorityDistribution(baseFilter)
    ]);

    // Destructuring status for easier mapping
    const { pending, "in progress": inProgress, completed } = statusDistribution;

    // Fetch recent tasks
    const recentTasks = await Task.find(baseFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    // Respond with the formatted dashboard data
    return res.json({
      statistics: {
        totalTasks,
        pendingTasks: pending,
        inProgressTasks: inProgress,
        completedTasks: completed,
        overdueTasks
      },
      charts: { statusDistribution, priorityDistribution },
      recentTasks
    });
  } catch (err) {
    // Improved error logging and response structure
    console.error(`Error occurred while fetching dashboard data: ${err.message}`);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
      stack: err.stack
    });
  }
};


module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskChecklist,
  getUserDashboardData,
  getDashboardData,
};
