export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
}

export interface ISignUpData {
  name: string;
  email: string;
  password: string;
}

export interface ISignUpResponse {
  message: string;
}

export interface IUserState {
  error: string | null;
  loading: boolean | null;
  token: string | null;
  isAuthenticated: boolean;
  userId: string;
  user: IUser;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface ILoginResponse {
  message: string;
  token: string;
  userId: string;
  user: IUser;
}

export interface IAuthUser {
  userId: string;
  name: string;
  email: string;
}
export interface IAuthRestoreResponse {
  user: IAuthUser;
  message: string;
}
