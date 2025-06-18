import Admin from "../models/AdminModel";
import { IAdmin, ISignUpData } from "../../../domain/entities/Admin";
import { IAdminRepository } from "../../../domain/interfaces/AdminRepository";

export class AdminRepository implements IAdminRepository {
  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    try {
      const admin = await Admin.findOne({ email });
      return admin;
    } catch (error) {
      return null;
    }
  }

  async createAdmin(data: ISignUpData) {
    const admin = new Admin(data);
    return await admin.save();
  }
}
