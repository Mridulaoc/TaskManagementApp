import { BcryptService } from "../../../utils/bcryptService";
import { generateToken } from "../../../utils/jwtService";
import { ILoginData, ILoginResponse } from "../../entities/admin";
import { AdminRepository } from "../../repositories.ts/adminRepo";

export class AdminLoginUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private bcryptService: BcryptService
  ) {}

  async execute(loginData: ILoginData): Promise<ILoginResponse> {
    const admin = await this.adminRepository.findAdminByEmail(loginData.email);
    if (!admin) throw new Error("Invalid email or password");
    const isMatch = await this.bcryptService.comparePasswords(
      loginData.password,
      admin.password
    );
    const token = generateToken({
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
