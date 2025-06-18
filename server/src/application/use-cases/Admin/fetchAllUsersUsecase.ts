import { IUser } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/UserRepository";

export class FetchAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}
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
