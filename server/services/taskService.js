import mongoose from "mongoose";
import Task from "../models/Task.js";

function buildQuery(userId, filters) {
  const query = { user: userId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.priority) {
    query.priority = filters.priority;
  }

  if (filters.search) {
    query.title = { $regex: filters.search, $options: "i" };
  }

  return query;
}

function sortObject(sort, order) {
  const direction = order === "desc" ? -1 : 1;

  const fields = {
    dueDate: "dueDate",
    priority: "priority",
    title: "title",
    createdAt: "createdAt"
  };

  return { [fields[sort] || "dueDate"]: direction };
}

export async function listTasks(userId, filters) {
  const query = buildQuery(userId, filters);

  return Task.find(query)
    .sort(sortObject(filters.sort, filters.order))
    .lean();
}

export async function findTask(id, userId) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid task ID.");
    error.statusCode = 400;
    throw error;
  }

  const task = await Task.findOne({ _id: id, user: userId });

  if (!task) {
    const error = new Error("Task not found.");
    error.statusCode = 404;
    throw error;
  }

  return task;
}

export async function createTask(userId, data) {
  return Task.create({
    user: userId,
    title: data.title.trim(),
    description: data.description.trim(),
    dueDate: data.dueDate,
    priority: data.priority || "Medium",
    status: data.status || "Pending"
  });
}

export async function updateTask(id, userId, data) {
  const task = await findTask(id, userId);

  const allowed = ["title", "description", "dueDate", "priority", "status"];

  for (const field of allowed) {
    if (data[field] !== undefined) {
      task[field] = typeof data[field] === "string" &&
        ["title", "description"].includes(field)
        ? data[field].trim()
        : data[field];
    }
  }

  await task.save();
  return task;
}

export async function deleteTask(id, userId) {
  const task = await findTask(id, userId);
  await task.deleteOne();
}

export async function getStats(userId) {
  const [total, completed, pending, highPriority, recentTasks] = await Promise.all([
    Task.countDocuments({ user: userId }),
    Task.countDocuments({ user: userId, status: "Completed" }),
    Task.countDocuments({ user: userId, status: "Pending" }),
    Task.countDocuments({ user: userId, priority: "High" }),
    Task.find({ user: userId }).sort({ createdAt: -1 }).limit(5).lean()
  ]);

  return {
    stats: {
      total,
      completed,
      pending,
      highPriority
    },
    recentTasks
  };
}
