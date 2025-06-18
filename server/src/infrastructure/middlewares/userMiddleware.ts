import { Request, Response, NextFunction } from "express";
import { JwtPayloadExtended, JwtService } from "../services/jwtService";
import { IUser } from "../../domain/entities/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const jwtService = new JwtService();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({ message: "Authorization header missing or invalid" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwtService.verifyToken(token) as JwtPayloadExtended;

    if (!decoded || !decoded.userId) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    const user: IUser = {
      _id: decoded.userId,
      email: decoded.email,
      name: "",
      password: "",
    };

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
