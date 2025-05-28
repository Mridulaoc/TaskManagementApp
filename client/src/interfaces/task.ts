export interface ITask {
  _id?: string;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: string[];
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  subtasks?: ISubTask[];
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ISubTask {
  _id?: string;
  title: string;
  isCompleted: boolean | undefined;
}

export interface IFetchTasksInput {
  page: number;
  limit: number;
}

export interface IFetchTasksResponse {
  tasks: ITask[];
  total: number;
  message: string;
}

export interface ITaskInitialState {
  loading: boolean;
  error: string | null;
  task: ITask;
  tasks: ITask[];
  userTasks: ITask[];
  total: number;
  page: number;
  limit: number;
  updatingTaskStatus: boolean;
  updatingSubtask: boolean;
}

export interface ITaskFormInput {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: string[];
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  subtasks?: ISubTask[];
}

export interface IAddTaskResponse {
  message: string;
}

export interface IUpdateTaskData {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: string[];
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  subtasks?: ISubTask[];
}

export interface IUpdateTaskResponse {
  task: ITask;
  message: string;
}

export interface IDeleteTaskResponse {
  message: string;
}

export interface IUpdateSubTaskInput {
  taskId: string;
  subtaskId: string;
  isCompleted: boolean;
}

export interface IUpdateSubTaskResponse {
  taskId: string;
  subtaskId: string;
  isCompleted: boolean;
  updatedTask: ITask;
}

export interface IUpdateTaskStatusResponse {
  taskId: string;
  status: "pending" | "in-progress" | "completed";
  updatedTask: ITask;
}
