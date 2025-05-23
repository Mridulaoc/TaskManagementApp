import bcrypt from "bcrypt";

export class BcryptService {
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

// export const hashPassword = async (password: string): Promise<string> => {
//   const saltRounds = 10;
//   return await bcrypt.hash(password, saltRounds);
// };
// export const comparePasswords = async (
//   plainPassword: string,
//   hashedPassword: string
// ): Promise<boolean> => {
//   return await bcrypt.compare(plainPassword, hashedPassword);
// };
