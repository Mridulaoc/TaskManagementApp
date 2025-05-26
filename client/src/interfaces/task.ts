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
  isCompleted: boolean;
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
  tasks: ITask[];
  total: number;
  page: number;
  limit: number;
}
