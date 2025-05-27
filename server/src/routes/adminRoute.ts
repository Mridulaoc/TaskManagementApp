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
  getTask,
  updateTask,
} from "../app/controller/taskController";

const adminRouter = express.Router();

adminRouter.post("/signup", adminSignUp);
adminRouter.post("/login", adminLogin);

adminRouter.get("/users", getAllUsers);
adminRouter.get("/tasks", getAllTasks);

adminRouter
  .route("/task/:taskId")
  .get(adminMiddleware, getTask)
  .put(adminMiddleware, updateTask)
  .delete(adminMiddleware, deleteTask);
adminRouter.post("/task", adminMiddleware, createTask);

export default adminRouter;
