export const TASK_ENDPOINTS = {
  GET_TASKS: "/get-tasks",
  ADD_TASK: "/task",
  FETCH_TASK: (id: string) => `/task/${id}`,
  UPDATE_TASK: (id: string) => `/task/${id}`,
  DELETE_TASK: (id: string) => `/task/${id}`,
  USER_TASKS: (userId: string) => `/${userId}/tasks`,
  UPDATE_SUBTASK_STATUS: (taskId: string, subtaskId: string) =>
    `/subtasks/${taskId}/${subtaskId}`,
  UPDATE_TASK_STATUS: (taskId: string) => `/${taskId}/status`,
  STATUS_CHART_DATA: "/chart-data/status",
  PRIORITY_CHART_DATA: "/chart-data/priority",
};
