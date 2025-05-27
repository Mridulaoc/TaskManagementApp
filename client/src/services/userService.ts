import type { AxiosResponse } from "axios";
import { userApi } from "../api";
import type {
  IAuthRestoreResponse,
  ILoginData,
  ILoginResponse,
  ISignUpData,
  ISignUpResponse,
} from "../interfaces/user";

export const userService = {
  signUp: async (
    submissionData: ISignUpData
  ): Promise<AxiosResponse<ISignUpResponse>> => {
    const response = await userApi.post("/", submissionData);
    return response;
  },

  login: async (
    loginData: ILoginData
  ): Promise<AxiosResponse<ILoginResponse>> => {
    const response = await userApi.post("/login", loginData);
    return response;
  },

  verifyToken: async (): Promise<AxiosResponse<IAuthRestoreResponse>> => {
    const response = await userApi.get("/verify-token");
    return response;
  },
};
