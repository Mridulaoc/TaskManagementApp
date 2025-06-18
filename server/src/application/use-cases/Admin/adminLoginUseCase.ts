import { ILoginData, ILoginResponse } from "../../../domain/entities/Admin";
import { IAdminRepository } from "../../../domain/interfaces/AdminRepository";
import { IBcryptService } from "../../../domain/interfaces/BCryptService";
import { IJwtService } from "../../../domain/interfaces/JwtService";

export class AdminLoginUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private bcryptService: IBcryptService,
    private jwtService: IJwtService
  ) {}

  async execute(loginData: ILoginData): Promise<ILoginResponse> {
    const admin = await this.adminRepository.findAdminByEmail(loginData.email);
    if (!admin) throw new Error("Invalid email or password");
    const isMatch = await this.bcryptService.comparePasswords(
      loginData.password,
      admin.password
    );

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    const token = this.jwtService.generateToken({
      adminId: admin._id.toString(),
      email: admin.email,
    });
    return {
      message: "Login Successfull",
      token,
      adminId: admin._id.toString(),
    };
  }
}
