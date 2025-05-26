import { IUser } from "../../entities/user";
import { UserRepository } from "../../repositories.ts/userRepo";

export class FetchAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(): Promise<IUser[] | null> {
    try {
      const users = await this.userRepository.findAll();
      if (!users) return null;
      return users;
    } catch (error) {
      throw new Error(" Could not fetch users");
    }
  }
}
