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
    if (status) filter.status = status;

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

    tasks = await Promise.all(
      tasks.map(async (task) => {
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        return { ...task._doc, completedTodoCount: completedCount };
      })
    );

    const countFilter =
      req.user.role === "admin" ? {} : { assignedTo: req.user._id };
    const allTasks = await Task.countDocuments(countFilter);
    const pendingTasks = await Task.countDocuments({
      ...countFilter,
      status: "Pending",
    });
    const inProgressTasks = await Task.countDocuments({
      ...countFilter,
      status: "In Progress",
    });
    const completedTasks = await Task.countDocuments({
      ...countFilter,
      status: "Completed",
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
// @route GET /api/tasks/:id
// @access Private

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
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
// @route Post /api/tasks/
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

    if (!title || !dueDate) {
      return res.status(400).json({ message: "Title and dueDate are required" });
    }

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

    // Optionally populate assigned users
    await task.populate("assignedTo", "name email profilePic");

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update Task details
// @route Put /api/tasks/:id
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
          .json({ message: "assignedTo must be an array of user IDs" });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
    await updatedTask.populate("assignedTo", "name email profileImageUrl"); // 👈 Consistent population

    res.json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Delete a Task (Admin Only)
// @route Delete /api/tasks/:id
// @access Private (Admin Only)

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update Task Status
// @route Put /api/tasks/:id/status
// @access Private (Admin Only)

const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Authorization
    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not Authorized" });
    }

    // Validate and normalize status
    const statusInput = req.body.status?.trim();
    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (statusInput && !validStatuses.includes(statusInput)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update status
    if (statusInput) {
      task.status = statusInput;

      if (statusInput === "Completed") {
        task.todoChecklist.forEach((item) => (item.completed = true));
        task.progress = 100;
      } else if (statusInput === "In Progress" || statusInput === "Pending") {
        // Optionally recalculate progress if checklist exists
        const completedCount = task.todoChecklist.filter(
          (item) => item.completed
        ).length;
        const totalItems = task.todoChecklist.length;
        task.progress =
          totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;
      }
    }

    await task.save();
    await task.populate("assignedTo", "name email profileImageUrl"); // optional, for consistency

    res.json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update Task Checklist
// @route Put /api/tasks/:id/todo
// @access Private (Admin + assigend user)

const updateTaskChecklist = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Authorization check
    const isAssigned = task.assignedTo.some(
      (userId) => userId.toString() === req.user._id.toString()
    );
    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not Authorized" });
    }

    // Update checklist
    if (req.body.todoChecklist) {
      task.todoChecklist = req.body.todoChecklist;

      // Recalculate progress & status
      const completedCount = task.todoChecklist.filter(
        (item) => item.completed
      ).length;
      const totalItems = task.todoChecklist.length;
      task.progress =
        totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

      if (task.progress === 100) task.status = "Completed";
      else if (task.progress > 0) task.status = "In Progress";
      else task.status = "Pending";
    }

    await task.save();
    await task.populate("assignedTo", "name email profileImageUrl"); // updated field

    res.json({ message: "Checklist updated", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Dashboard Data (user-specific)
// @route Get /api/tasks/dashboard-data
// @access Private (user Only)

const getUserDashboardData = async (req, res) => {
  try {
    const baseFilter =
      req.user.role === "admin" ? {} : { assignedTo: req.user._id };

    const getCount = async (filter) => await Task.countDocuments(filter);

    const getStatusDistribution = async (filter) => {
      const rawStatus = await Task.aggregate([
        { $match: filter },
        { $project: { status: { $toLower: { $trim: { input: "$status" } } } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      const statusDistribution = { pending: 0, "in progress": 0, completed: 0 };
      rawStatus.forEach(({ _id, count }) => {
        if (_id && statusDistribution[_id] !== undefined) {
          statusDistribution[_id] = count;
        }
      });
      return statusDistribution;
    };

    const getPriorityDistribution = async (filter) => {
      const rawPrio = await Task.aggregate([
        { $match: filter },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]);
      const priorityLevels = ["Low", "Medium", "High"];
      return priorityLevels.reduce((acc, level) => {
        const found = rawPrio.find((i) => i._id === level);
        acc[level] = found ? found.count : 0;
        return acc;
      }, {});
    };

    const [totalTasks, overdueTasks] = await Promise.all([
      getCount(baseFilter),
      getCount({
        ...baseFilter,
        status: { $ne: "Completed" },
        dueDate: { $lt: new Date() },
      }),
    ]);

    const [statusDistribution, priorityDistribution] = await Promise.all([
      getStatusDistribution(baseFilter),
      getPriorityDistribution(baseFilter),
    ]);

    const {
      pending,
      "in progress": inProgress,
      completed,
    } = statusDistribution;

    const recentTasks = await Task.find(baseFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");
    // .populate("assignedTo", "name email profilePic"); // Uncomment if needed

    return res.json({
      statistics: {
        totalTasks,
        pendingTasks: pending,
        inProgressTasks: inProgress,
        completedTasks: completed,
        overdueTasks,
      },
      charts: { statusDistribution, priorityDistribution },
      recentTasks,
    });
  } catch (err) {
    console.error(
      `Error occurred while fetching dashboard data: ${err.message}`
    );
    return res.status(500).json({
      message: "Server error",
      error: err.message,
      stack: err.stack,
    });
  }
};

// @desc Dashboard Data (Admin Only)
// @route Get /api/tasks/dashboard-data
// @access Private (Admin Only)

const getDashboardData = async (req, res) => {
  try {
    const baseFilter =
      req.user.role === "admin" ? {} : { assignedTo: req.user._id };

    const getCount = async (filter) => await Task.countDocuments(filter);

    const getStatusDistribution = async (filter) => {
      const rawStatus = await Task.aggregate([
        { $match: filter },
        {
          $project: {
            status: { $toLower: { $trim: { input: "$status" } } },
          },
        },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);
      const defaultStatus = { pending: 0, "in progress": 0, completed: 0 };
      rawStatus.forEach(({ _id, count }) => {
        if (_id && defaultStatus[_id] !== undefined) {
          defaultStatus[_id] = count;
        }
      });
      return defaultStatus;
    };

    const getPriorityDistribution = async (filter) => {
      const rawPrio = await Task.aggregate([
        { $match: filter },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]);
      const priorityLevels = ["Low", "Medium", "High"];
      return priorityLevels.reduce((acc, level) => {
        const found = rawPrio.find((i) => i._id === level);
        acc[level] = found ? found.count : 0;
        return acc;
      }, {});
    };

    const [totalTasks, overdueTasks] = await Promise.all([
      getCount(baseFilter),
      getCount({
        ...baseFilter,
        status: { $ne: "Completed" },
        dueDate: { $lt: new Date() },
      }),
    ]);

    const [statusDistribution, priorityDistribution] = await Promise.all([
      getStatusDistribution(baseFilter),
      getPriorityDistribution(baseFilter),
    ]);

    const {
      pending,
      "in progress": inProgress,
      completed,
    } = statusDistribution;

    const recentTasks = await Task.find(baseFilter)
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");
    // .populate("assignedTo", "name email profilePic"); // Uncomment if needed

    return res.json({
      statistics: {
        totalTasks,
        pendingTasks: pending,
        inProgressTasks: inProgress,
        completedTasks: completed,
        overdueTasks,
      },
      charts: { statusDistribution, priorityDistribution },
      recentTasks,
    });
  } catch (err) {
    console.error(
      `Error occurred while fetching dashboard data: ${err.message}`
    );
    return res.status(500).json({
      message: "Server error",
      error: err.message,
      stack: err.stack,
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
