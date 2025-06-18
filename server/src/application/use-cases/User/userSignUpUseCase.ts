import { ISignUpData, IUser } from "../../../domain/entities/User";
import { IBcryptService } from "../../../domain/interfaces/BCryptService";
import { IUserRepository } from "../../../domain/interfaces/UserRepository";

export class UserSignUpUseCase {
  constructor(
    private userRepository: IUserRepository,
    private bcryptService: IBcryptService
  ) {}

  async execute(data: ISignUpData): Promise<IUser> {
    const existingUser = await this.userRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error("Email is already existing");
    }
    const hashedPassword = await this.bcryptService.hashPassword(data.password);
    const user = await this.userRepository.createUser({
      ...data,
      password: hashedPassword,
    });
    return user;
  }
}
