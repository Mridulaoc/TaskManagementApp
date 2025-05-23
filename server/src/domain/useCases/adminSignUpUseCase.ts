import { BcryptService } from "../../utils/bcryptService";
import { IAdmin, ISignUpData } from "../entities/admin";
import { AdminRepository } from "../repositories.ts/adminRepo";

export class AdminSignUpUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private bcryptService: BcryptService
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
