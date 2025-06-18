import {
  IGetPriorityCountResponse,
  IGetStatusCountResponse,
  ITask,
  ITaskData,
} from "../entities/Task";

export interface ITaskRepository {
  create(data: ITaskData): Promise<ITask | null>;
  findAllTasks(
    page: number,
    limit: number
  ): Promise<{ tasks: ITask[]; total: number }>;
  findById(taskId: string): Promise<ITask | null>;
  update(taskId: string, data: Partial<ITask>): Promise<ITask | null>;
  delete(taskId: string): Promise<boolean>;
  findUserTasks(userId: string): Promise<ITask[]>;
  updateSubtaskStatus(
    taskId: string,
    subtaskId: string,
    isCompleted: boolean
  ): Promise<ITask>;
  updateTaskStatus(
    taskId: string,
    status: "pending" | "in-progress" | "completed"
  ): Promise<ITask>;
  getStatusCounts(): Promise<IGetStatusCountResponse[]>;
  getPriorityCounts(): Promise<IGetPriorityCountResponse[]>;
}
