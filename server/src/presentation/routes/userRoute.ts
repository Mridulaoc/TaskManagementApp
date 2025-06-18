import express from "express";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { BcryptService } from "../../infrastructure/services/bcryptService";
import { JwtService } from "../../infrastructure/services/jwtService";
import { UserSignUpUseCase } from "../../application/use-cases/User/userSignUpUseCase";
import { UserLoginUseCase } from "../../application/use-cases/User/userLoginUseCase";
import { UserController } from "../controller/userController";
import { authMiddleware } from "../../infrastructure/middlewares/userMiddleware";

const userRouter = express.Router();

const userRepo = new UserRepository();
const bcryptService = new BcryptService();
const jwtService = new JwtService();

const userSignUpUseCase = new UserSignUpUseCase(userRepo, bcryptService);
const userLoginUseCase = new UserLoginUseCase(
  userRepo,
  bcryptService,
  jwtService
);

const userController = new UserController(userSignUpUseCase, userLoginUseCase);

userRouter.post("/", userController.userSignUp);
userRouter.post("/login", userController.userLogin);
userRouter.get("/verify-token", authMiddleware, userController.verifyToken);

export default userRouter;
