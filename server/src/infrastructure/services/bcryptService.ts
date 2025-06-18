import bcrypt from "bcrypt";
import { IBcryptService } from "../../domain/interfaces/BCryptService";

export class BcryptService implements IBcryptService {
  private saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
