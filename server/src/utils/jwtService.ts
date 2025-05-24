import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const SECRET_KEY: string = process.env.JWT_SECRET_KEY || "your_secret_key";

export interface JwtPayloadExtended extends JwtPayload {
  userId?: string;
  adminId?: string;
  email: string;
}

export const generateToken = (payload: Partial<JwtPayloadExtended>): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
};

export const verifyToken = (token: string): JwtPayloadExtended => {
  return jwt.verify(token, SECRET_KEY) as JwtPayloadExtended;
};
