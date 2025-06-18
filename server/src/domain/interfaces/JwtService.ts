import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export interface JwtPayloadExtended extends JwtPayload {
  userId?: string;
  adminId?: string;
  email: string;
}

export interface IJwtService {
  generateToken(payload: Partial<JwtPayloadExtended>): string;
  verifyToken(token: string): JwtPayloadExtended;
}
