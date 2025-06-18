import { IAdmin } from "../entities/Admin";
import { ISignUpData } from "../entities/User";

export interface IAdminRepository {
  findAdminByEmail(email: string): Promise<IAdmin | null>;
  createAdmin(data: ISignUpData): Promise<IAdmin>;
}
