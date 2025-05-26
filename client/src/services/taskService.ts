import type { AxiosResponse } from "axios";
import type { IFetchTasksInput, IFetchTasksResponse } from "../interfaces/task";
import { adminApi } from "../api";

export const taskService = {
  fetchTasks: async (
    params: IFetchTasksInput
  ): Promise<AxiosResponse<IFetchTasksResponse>> => {
    const response = await adminApi.get("/tasks", { params });
    return response;
  },
};
