import express from "express";

import {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/stats", getTaskStats);

router.get("/", getTasks);

router.post("/", createTask);

router.get("/:id", getTaskById);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;