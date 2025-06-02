import { Request, Response } from "express";

import { UserRepository } from "../../domain/repositories.ts/userRepo";
import { SignUpUseCase } from "../../domain/useCases/user/signupUseCase";
import { generateToken } from "../../utils/jwtService";
import { BcryptService } from "../../utils/bcryptService";
import { LoginUseCase } from "../../domain/useCases/user/loginUsecase";

const userRepository = new UserRepository();
const bcryptService = new BcryptService();
const signupUsecase = new SignUpUseCase(userRepository, bcryptService);
const loginUseCase = new LoginUseCase(userRepository, bcryptService);

// export const userSignUp = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const submissionData = req.body;
//     const user = await signupUsecase.execute(submissionData);
//     if (!user) throw new Error("Could not create user");
//     res.status(200).json({ message: "User signed up successfully" });
//   } catch (error) {
//     res.status(400).json({
//       message: error instanceof Error ? error.message : "Signup failed",
//     });
//   }
// };

export const userSignUp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const submissionData = req.body;
    const user = await signupUsecase.execute(submissionData);
    res.status(201).json({ message: "User signed up successfully" });
  } catch (error) {
    const statusCode =
      error instanceof Error && error.message === "Email is already existing"
        ? 409
        : 400;

    res.status(statusCode).json({
      message: error instanceof Error ? error.message : "Signup failed",
    });
  }
};

export const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginData = req.body;
    console.log("Controller", loginData);
    const result = await loginUseCase.execute(loginData);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : "Login failed",
    });
  }
};

export const verifyToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({
      user: {
        userId: req.user?._id,
        email: req.user?.email,
        name: req.user?.name,
      },
      message: "Token is valid",
    });
  } catch (error) {
    res.status(500).json({ message: "Token is invalid" });
  }
};
