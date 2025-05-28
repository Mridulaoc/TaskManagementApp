import express from "express";
import {
  adminLogin,
  adminSignUp,
  getAllUsers,
} from "../app/controller/adminController";
import { adminMiddleware } from "../app/middleware/adminMiddleware";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getPriorityChartData,
  getStatusChartData,
  getTask,
  updateTask,
} from "../app/controller/taskController";

const adminRouter = express.Router();

adminRouter.post("/signup", adminSignUp);
adminRouter.post("/login", adminLogin);

adminRouter.get("/users", getAllUsers);
adminRouter.get("/get-tasks", adminMiddleware, getAllTasks);

adminRouter
  .route("/task/:taskId")
  .get(adminMiddleware, getTask)
  .put(adminMiddleware, updateTask)
  .delete(adminMiddleware, deleteTask);
adminRouter.post("/task", adminMiddleware, createTask);

adminRouter.get("/chart-data/status", adminMiddleware, getStatusChartData);
adminRouter.get("/chart-data/priority", adminMiddleware, getPriorityChartData);

export default adminRouter;
