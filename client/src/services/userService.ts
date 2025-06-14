import type { AxiosResponse } from "axios";
import { userApi } from "../api";
import type {
  IAuthRestoreResponse,
  ILoginData,
  ILoginResponse,
  ISignUpData,
  ISignUpResponse,
} from "../interfaces/user";
import { USER_ENDPOINTS } from "../constants/userEndpoints";

export const userService = {
  signUp: async (
    submissionData: ISignUpData
  ): Promise<AxiosResponse<ISignUpResponse>> => {
    const response = await userApi.post(USER_ENDPOINTS.SIGNUP, submissionData);
    return response;
  },

  login: async (
    loginData: ILoginData
  ): Promise<AxiosResponse<ILoginResponse>> => {
    const response = await userApi.post(USER_ENDPOINTS.LOGIN, loginData);
    return response;
  },

  verifyToken: async (): Promise<AxiosResponse<IAuthRestoreResponse>> => {
    const response = await userApi.get(USER_ENDPOINTS.VERIFY_TOKEN);
    return response;
  },
};
