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

adminRouter.get("/users", adminMiddleware, getAllUsers);

adminRouter
  .route("/task/:taskId")
  .get(adminMiddleware, getTask)
  .post(adminMiddleware, updateTask)
  .delete(adminMiddleware, deleteTask);
adminRouter.post("/task", adminMiddleware, createTask);
adminRouter.get("/tasks", adminMiddleware, getAllTasks);

export default adminRouter;
