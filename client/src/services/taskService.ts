import type { AxiosResponse } from "axios";
import type {
  IAddTaskResponse,
  IDeleteTaskResponse,
  IFetchTasksInput,
  IFetchTasksResponse,
  ITask,
  ITaskFormInput,
  IUpdateTaskData,
  IUpdateTaskResponse,
} from "../interfaces/task";
import { adminApi, userApi } from "../api";

export const taskService = {
  fetchTasks: async (
    params: IFetchTasksInput
  ): Promise<AxiosResponse<IFetchTasksResponse>> => {
    const response = await adminApi.get("/get-tasks", { params });
    return response;
  },
  addTask: async (
    submissionData: ITaskFormInput
  ): Promise<AxiosResponse<IAddTaskResponse>> => {
    const response = await adminApi.post("/task", submissionData);
    return response;
  },
  fetchTask: async (taskId: string): Promise<AxiosResponse<ITask>> => {
    const response = await adminApi.get(`/task/${taskId}`);
    return response;
  },

  updatetask: async (
    taskId: string,
    taskData: IUpdateTaskData
  ): Promise<AxiosResponse<IUpdateTaskResponse>> => {
    const response = await adminApi.put(`/task/${taskId}`, taskData);
    return response.data;
  },

  deleteTask: async (
    taskId: string
  ): Promise<AxiosResponse<IDeleteTaskResponse>> => {
    const response = await adminApi.delete(`/task/${taskId}`);
    return response;
  },

  fetchUserTasks: async (userId: string): Promise<AxiosResponse<ITask[]>> => {
    const response = await userApi.get(`/${userId}/tasks`);
    return response;
  },
};
