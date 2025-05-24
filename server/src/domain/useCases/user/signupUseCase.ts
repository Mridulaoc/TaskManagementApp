import { BcryptService } from "../../../utils/bcryptService";
import { ISignUpData, IUser } from "../../entities/user";
import { UserRepository } from "../../repositories.ts/userRepo";

export class SignUpUseCase {
  constructor(
    private userRepository: UserRepository,
    private bcryptService: BcryptService
  ) {}

  async execute(data: ISignUpData): Promise<IUser | null> {
    try {
      const existingUser = await this.userRepository.findUserByEmail(
        data.email
      );
      if (existingUser) {
        throw new Error("Email is already existing");
      }
      const hashedPassword = await this.bcryptService.hashPassword(
        data.password
      );
      const user = await this.userRepository.createUser({
        ...data,
        password: hashedPassword,
      });
      return user;
    } catch (error) {
      return null;
    }
  }
}
