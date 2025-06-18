import { ISignUpData, IUser } from "../entities/User";

export interface IUserRepository {
  findUserByEmail(email: string): Promise<IUser | null>;
  createUser(data: ISignUpData): Promise<IUser>;
  findAll(): Promise<IUser[] | null>;
}
