import { ILoginData, ILoginResponse } from "../../../domain/entities/User";
import { IBcryptService } from "../../../domain/interfaces/BCryptService";
import { IJwtService } from "../../../domain/interfaces/JwtService";
import { IUserRepository } from "../../../domain/interfaces/UserRepository";

export class UserLoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private bcryptService: IBcryptService,
    private jwtService: IJwtService
  ) {}

  async execute(loginData: ILoginData): Promise<ILoginResponse> {
    const user = await this.userRepository.findUserByEmail(loginData.email);
    if (!user) throw new Error("Invalid email or password");
    console.log("Passwords,", loginData.password, user.password);
    const isMatch = await this.bcryptService.comparePasswords(
      loginData.password,
      user.password
    );

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    const token = this.jwtService.generateToken({
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
