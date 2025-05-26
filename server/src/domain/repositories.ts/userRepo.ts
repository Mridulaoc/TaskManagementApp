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

  async findAll(): Promise<IUser[] | null> {
    try {
      const users = await User.find();
      if (!users) return null;
      return users;
    } catch (error) {
      throw new Error("Could not fetch users");
    }
  }
}
