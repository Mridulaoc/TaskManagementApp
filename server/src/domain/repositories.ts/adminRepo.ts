import Admin from "../../models/adminModel";
import { IAdmin, ISignUpData } from "../entities/admin";

export class AdminRepository {
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
