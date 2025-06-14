import type { AxiosResponse } from "axios";
import type {
  IAddTaskResponse,
  IChartData,
  IDeleteTaskResponse,
  IFetchTasksInput,
  IFetchTasksResponse,
  ITask,
  ITaskFormInput,
  IUpdateSubTaskResponse,
  IUpdateTaskData,
  IUpdateTaskResponse,
  IUpdateTaskStatusResponse,
} from "../interfaces/task";
import { adminApi, userApi } from "../api";
import { TASK_ENDPOINTS } from "../constants/taskEndpoints";

export const taskService = {
  fetchTasks: async (
    params: IFetchTasksInput
  ): Promise<AxiosResponse<IFetchTasksResponse>> => {
    const response = await adminApi.get(TASK_ENDPOINTS.GET_TASKS, { params });
    return response;
  },
  addTask: async (
    submissionData: ITaskFormInput
  ): Promise<AxiosResponse<IAddTaskResponse>> => {
    const response = await adminApi.post(
      TASK_ENDPOINTS.ADD_TASK,
      submissionData
    );
    return response;
  },
  fetchTask: async (taskId: string): Promise<AxiosResponse<ITask>> => {
    const response = await adminApi.get(TASK_ENDPOINTS.FETCH_TASK(taskId));
    return response;
  },

  updatetask: async (
    taskId: string,
    taskData: IUpdateTaskData
  ): Promise<AxiosResponse<IUpdateTaskResponse>> => {
    const response = await adminApi.put(
      TASK_ENDPOINTS.UPDATE_TASK(taskId),
      taskData
    );
    return response.data;
  },

  deleteTask: async (
    taskId: string
  ): Promise<AxiosResponse<IDeleteTaskResponse>> => {
    const response = await adminApi.delete(TASK_ENDPOINTS.DELETE_TASK(taskId));
    return response;
  },

  fetchUserTasks: async (userId: string): Promise<AxiosResponse<ITask[]>> => {
    const response = await userApi.get(TASK_ENDPOINTS.USER_TASKS(userId));
    return response;
  },

  updateSubtaskStatus: async (
    taskId: string,
    subtaskId: string,
    isCompleted: boolean
  ): Promise<AxiosResponse<IUpdateSubTaskResponse>> => {
    const response = await userApi.patch(
      TASK_ENDPOINTS.UPDATE_SUBTASK_STATUS(taskId, subtaskId),
      {
        isCompleted,
      }
    );
    return response;
  },

  updateTaskStatus: async (
    taskId: string,
    status: "pending" | "in-progress" | "completed"
  ): Promise<AxiosResponse<IUpdateTaskStatusResponse>> => {
    const response = await userApi.patch(
      TASK_ENDPOINTS.UPDATE_TASK_STATUS(taskId),
      {
        status,
      }
    );
    return response;
  },
  fetchStatusChartData: async (): Promise<AxiosResponse<IChartData>> => {
    const response = await adminApi.get(TASK_ENDPOINTS.STATUS_CHART_DATA);
    return response;
  },
  fetchPriorityChartData: async (): Promise<AxiosResponse<IChartData>> => {
    const response = await adminApi.get(TASK_ENDPOINTS.PRIORITY_CHART_DATA);
    return response;
  },
};
