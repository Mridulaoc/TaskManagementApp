import type { AxiosResponse } from "axios";
import { adminApi } from "../api";
import type {
  ILoginData,
  ILoginResponse,
  ISignUpData,
  ISignUpResponse,
} from "../interfaces/admin";
import { IUser } from "../interfaces/user";
import { ADMIN_ENDPOINTS } from "../constants/adminEndpoints";

export const adminService = {
  signUp: async (
    submissionData: ISignUpData
  ): Promise<AxiosResponse<ISignUpResponse>> => {
    const response = await adminApi.post(
      ADMIN_ENDPOINTS.SIGNUP,
      submissionData
    );
    return response;
  },

  login: async (
    loginData: ILoginData
  ): Promise<AxiosResponse<ILoginResponse>> => {
    const response = await adminApi.post(ADMIN_ENDPOINTS.LOGIN, loginData);
    return response;
  },

  fetchAllUsers: async (): Promise<AxiosResponse<IUser[]>> => {
    const response = await adminApi.get(ADMIN_ENDPOINTS.USERS);
    return response;
  },
};
