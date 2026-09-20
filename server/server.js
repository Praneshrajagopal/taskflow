import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Employee Task Management API is running",
  });
});


app.use(
  "/api/auth",
  authRoutes
);


app.use(
  "/api/tasks",
  taskRoutes
);


connectDB();


app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});