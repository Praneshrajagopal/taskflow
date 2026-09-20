import mongoose from "mongoose";
import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      status,
      priority,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {
      user: new mongoose.Types.ObjectId(userId),
    };

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "dueDate",
      "title",
      "priority",
      "status",
    ];

    const sortField = allowedSortFields.includes(sort)
      ? sort
      : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;

    const tasks = await Task.find(filter)
      .sort({
        [sortField]: sortOrder,
      })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    console.error("GET TASKS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve tasks",
      error: error.message,
    });
  }
};


export const getTaskStats = async (req, res) => {
  try {
    console.log("TASK STATS ROUTE REACHED");
    console.log("USER:", req.user);

    const userId = req.user.userId;

    const stats = await Task.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,

          total: {
            $sum: 1,
          },

          pending: {
            $sum: {
              $cond: [
                { $eq: ["$status", "pending"] },
                1,
                0,
              ],
            },
          },

          inProgress: {
            $sum: {
              $cond: [
                { $eq: ["$status", "in-progress"] },
                1,
                0,
              ],
            },
          },

          completed: {
            $sum: {
              $cond: [
                { $eq: ["$status", "completed"] },
                1,
                0,
              ],
            },
          },

          cancelled: {
            $sum: {
              $cond: [
                { $eq: ["$status", "cancelled"] },
                1,
                0,
              ],
            },
          },

          highPriority: {
            $sum: {
              $cond: [
                { $eq: ["$priority", "high"] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const result = stats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
      highPriority: 0,
    };

    const completionPercentage =
      result.total > 0
        ? Math.round(
            (result.completed / result.total) * 100
          )
        : 0;

    return res.status(200).json({
      success: true,
      message: "Task statistics retrieved successfully",
      data: {
        total: result.total,
        pending: result.pending,
        inProgress: result.inProgress,
        completed: result.completed,
        cancelled: result.cancelled,
        highPriority: result.highPriority,
        completionPercentage,
      },
    });
  } catch (error) {
    console.error("TASK STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve task statistics",
      error: error.message,
    });
  }
};


export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("GET TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve task",
      error: error.message,
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      priority,
      dueDate,
      user: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
      error: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update task",
      error: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
      error: error.message,
    });
  }
};