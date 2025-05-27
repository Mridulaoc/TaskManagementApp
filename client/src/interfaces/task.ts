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
  total: number;
  page: number;
  limit: number;
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
