import { Request, Response } from "express";
import { BcryptService } from "../../utils/bcryptService";
import { AdminSignUpUseCase } from "../../domain/useCases/admin/adminSignUpUseCase";
import { AdminRepository } from "../../domain/repositories.ts/adminRepo";
import { AdminLoginUseCase } from "../../domain/useCases/admin/adminLoginUsecase";
import { FetchAllUsersUseCase } from "../../domain/useCases/admin/fetchAllUsersUseCase";
import { UserRepository } from "../../domain/repositories.ts/userRepo";

const adminRepository = new AdminRepository();
const userRepository = new UserRepository();
const bcryptService = new BcryptService();
const adminSignupUsecase = new AdminSignUpUseCase(
  adminRepository,
  bcryptService
);
const adminLoginUseCase = new AdminLoginUseCase(adminRepository, bcryptService);
const fetchAllUsersUseCase = new FetchAllUsersUseCase(userRepository);

export const adminSignUp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const submissionData = req.body;

    const admin = await adminSignupUsecase.execute(submissionData);
    if (!admin) throw new Error("Could not create admin");
    res.status(200).json({ message: "Admin signed up successfully" });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Signup failed",
    });
  }
};

export const adminLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const loginData = req.body;
    const result = await adminLoginUseCase.execute(loginData);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await fetchAllUsersUseCase.execute();
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch users" });
  }
};
