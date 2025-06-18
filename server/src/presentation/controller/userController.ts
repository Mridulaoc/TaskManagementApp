import { Request, Response } from "express";
import { UserSignUpUseCase } from "../../application/use-cases/User/userSignUpUseCase";
import { UserLoginUseCase } from "../../application/use-cases/User/userLoginUseCase";
import { HttpStatus } from "../constants/httpStatuscode";
import { ResponseMessages } from "../constants/responseMessages";

export class UserController {
  constructor(
    private userSignUpUseCase: UserSignUpUseCase,
    private userLoginUseCase: UserLoginUseCase
  ) {}

  userSignUp = async (req: Request, res: Response): Promise<void> => {
    try {
      const submissionData = req.body;
      const user = await this.userSignUpUseCase.execute(submissionData);
      res
        .status(HttpStatus.CREATED)
        .json({ message: ResponseMessages.USER_SIGNUP_SUCCESS });
    } catch (error) {
      const statusCode =
        error instanceof Error &&
        error.message === ResponseMessages.USER_ALREADY_EXISTS
          ? HttpStatus.CONFLICT
          : HttpStatus.BAD_REQUEST;

      res.status(statusCode).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.USER_SIGNUP_FAIL,
      });
    }
  };

  userLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData = req.body;
      const result = await this.userLoginUseCase.execute(loginData);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        message:
          error instanceof Error
            ? error.message
            : ResponseMessages.USER_LOGIN_FAIL,
      });
    }
  };

  verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(HttpStatus.OK).json({
        user: {
          userId: req.user?._id,
          email: req.user?.email,
          name: req.user?.name,
        },
        message: ResponseMessages.TOKEN_VALID,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.TOKEN_INVALID });
    }
  };
}
