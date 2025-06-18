import User from "../models/UserModel";
import { ISignUpData, IUser } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/UserRepository";

export class UserRepository implements IUserRepository {
  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await User.findOne({ email });
    return user;
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
