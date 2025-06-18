import { AdminLoginUseCase } from "../../application/use-cases/Admin/adminLoginUseCase";
import { AdminSignUpUseCase } from "../../application/use-cases/Admin/adminSignupUseCase";
import { FetchAllUsersUseCase } from "../../application/use-cases/Admin/fetchAllUsersUsecase";
import { Request, Response } from "express";
import { ResponseMessages } from "../constants/responseMessages";
import { HttpStatus } from "../constants/httpStatuscode";

export class AdminController {
  constructor(
    private adminSignupUseCase: AdminSignUpUseCase,
    private adminLoginUseCase: AdminLoginUseCase,
    private fetchAllUsersUseCase: FetchAllUsersUseCase
  ) {}

  adminSignUp = async (req: Request, res: Response): Promise<void> => {
    try {
      const submissionData = req.body;
      const admin = await this.adminSignupUseCase.execute(submissionData);
      if (!admin) throw new Error(ResponseMessages.ADMIN_CREATION_ERROR);
      res
        .status(HttpStatus.OK)
        .json({ message: ResponseMessages.ADMIN_SIGNUP_SUCCESS });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.ADMIN_SIGNUP_FAIL,
      });
    }
  };

  adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData = req.body;
      const result = await this.adminLoginUseCase.execute(loginData);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.ADMIN_LOGIN_FAIL,
      });
    }
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.fetchAllUsersUseCase.execute();
      res.status(HttpStatus.OK).json(users);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.USERS_FETCH_FAIL });
    }
  };
}
