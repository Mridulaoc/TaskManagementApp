export const TASK_ENDPOINTS = {
  GET_TASKS: "/task/get-tasks",
  ADD_TASK: "/task/",
  FETCH_TASK: (taskId: string) => `/task/${taskId}`,
  UPDATE_TASK: (taskId: string) => `/task/${taskId}`,
  DELETE_TASK: (taskId: string) => `/task/${taskId}`,
  USER_TASKS: (userId: string) => `/task/${userId}/tasks`,
  UPDATE_SUBTASK_STATUS: (taskId: string, subtaskId: string) =>
    `/task/subtasks/${taskId}/${subtaskId}`,
  UPDATE_TASK_STATUS: (taskId: string) => `/task/${taskId}/status`,
  STATUS_CHART_DATA: "/task/chart-data/status",
  PRIORITY_CHART_DATA: "/task/chart-data/priority",
};
