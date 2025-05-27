import express from "express";
import {
  userLogin,
  userSignUp,
  verifyToken,
} from "../app/controller/userController";
import { authMiddleware } from "../app/middleware/userMiddleware";
import { getAllUserTasks } from "../app/controller/taskController";

const userRouter = express.Router();

userRouter.post("/", userSignUp);
userRouter.post("/login", userLogin);
userRouter.get("/verify-token", authMiddleware, verifyToken);
userRouter.get("/:userId/tasks", authMiddleware, getAllUserTasks);

export default userRouter;
