import User from "../../models/userModel";
import { ISignUpData, IUser } from "../entities/user";

export class UserRepository {
  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      return null;
    }
  }

  async createUser(data: ISignUpData) {
    const user = new User(data);
    return await user.save();
  }
}
