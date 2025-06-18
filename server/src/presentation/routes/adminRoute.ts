import express from "express";
import { UserRepository } from "../../infrastructure/database/repositories/UserRepository";
import { AdminRepository } from "../../infrastructure/database/repositories/AdminRepository";
import { AdminController } from "../controller/adminController";
import { BcryptService } from "../../infrastructure/services/bcryptService";
import { JwtService } from "../../infrastructure/services/jwtService";
import { AdminSignUpUseCase } from "../../application/use-cases/Admin/adminSignupUseCase";
import { AdminLoginUseCase } from "../../application/use-cases/Admin/adminLoginUseCase";
import { FetchAllUsersUseCase } from "../../application/use-cases/Admin/fetchAllUsersUsecase";
import { adminMiddleware } from "../../infrastructure/middlewares/adminMiddleware";

const adminRouter = express.Router();
const adminRepo = new AdminRepository();
const userRepo = new UserRepository();
const bcryptService = new BcryptService();
const jwtService = new JwtService();

const adminSignupUseCase = new AdminSignUpUseCase(adminRepo, bcryptService);
const adminLoginUseCase = new AdminLoginUseCase(
  adminRepo,
  bcryptService,
  jwtService
);
const fetchAllUsersUseCase = new FetchAllUsersUseCase(userRepo);

const adminController = new AdminController(
  adminSignupUseCase,
  adminLoginUseCase,
  fetchAllUsersUseCase
);

adminRouter.post("/signup", adminController.adminSignUp);
adminRouter.post("/login", adminController.adminLogin);

adminRouter.get("/users", adminMiddleware, adminController.getAllUsers);

export default adminRouter;
