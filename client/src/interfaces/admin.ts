export interface IAdmin {
  name: string;
  email: string;
  password: string;
}

export interface IAdminState {
  loading: boolean;
  error: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ISignUpData {
  name: string;
  email: string;
  password: string;
}

export interface ISignUpResponse {
  message: string;
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
