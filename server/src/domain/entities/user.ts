export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export interface ISignUpData {
  name: string;
  email: string;
  password: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface ILoginResponse {
  message: string;
  token: string;
  userId: string;
}
