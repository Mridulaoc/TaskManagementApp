import { IAdmin } from "../../../domain/entities/Admin";
import { ISignUpData } from "../../../domain/entities/User";
import { IAdminRepository } from "../../../domain/interfaces/AdminRepository";
import { IBcryptService } from "../../../domain/interfaces/BCryptService";

export class AdminSignUpUseCase {
  constructor(
    private adminRepository: IAdminRepository,
    private bcryptService: IBcryptService
  ) {}

  async execute(data: ISignUpData): Promise<IAdmin | null> {
    try {
      const existingAdmin = await this.adminRepository.findAdminByEmail(
        data.email
      );
      if (existingAdmin) {
        throw new Error("Email is already existing");
      }
      const hashedPassword = await this.bcryptService.hashPassword(
        data.password
      );
      const admin = await this.adminRepository.createAdmin({
        ...data,
        password: hashedPassword,
      });
      return admin;
    } catch (error) {
      return null;
    }
  }
}
