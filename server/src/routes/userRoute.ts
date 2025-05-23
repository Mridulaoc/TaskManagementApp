import express from "express";
import { userLogin, userSignUp } from "../app/controller/userController";

const userRouter = express.Router();

userRouter.post("/", userSignUp);
userRouter.post("/login", userLogin);

export default userRouter;
