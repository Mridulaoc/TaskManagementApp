import type { AxiosResponse } from "axios";
import { adminApi } from "../api";
import type {
  ILoginData,
  ILoginResponse,
  ISignUpData,
  ISignUpResponse,
} from "../interfaces/admin";
import { IUser } from "../interfaces/user";

export const adminService = {
  signUp: async (
    submissionData: ISignUpData
  ): Promise<AxiosResponse<ISignUpResponse>> => {
    const response = await adminApi.post("/signup", submissionData);
    return response;
  },

  login: async (
    loginData: ILoginData
  ): Promise<AxiosResponse<ILoginResponse>> => {
    const response = await adminApi.post("/login", loginData);
    return response;
  },

  fetchAllUsers: async (): Promise<AxiosResponse<IUser[]>> => {
    const response = await adminApi.get("/users");
    return response;
  },
};
