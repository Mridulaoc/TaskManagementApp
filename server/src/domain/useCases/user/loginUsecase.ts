import { BcryptService } from "../../../utils/bcryptService";
import { generateToken } from "../../../utils/jwtService";
import { ILoginData, ILoginResponse } from "../../entities/user";
import { UserRepository } from "../../repositories.ts/userRepo";

export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private bcryptService: BcryptService
  ) {}

  async execute(loginData: ILoginData): Promise<ILoginResponse> {
    const user = await this.userRepository.findUserByEmail(loginData.email);
    if (!user) throw new Error("Invalid email or password");
    const isMatch = await this.bcryptService.comparePasswords(
      loginData.password,
      user.password
    );
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });
    return {
      message: "Login Successfull",
      token,
      userId: user._id.toString(),
      user,
    };
  }
}
