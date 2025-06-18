import { ITask } from "../entities/Task";

export interface ISocketNotificationService {
  extractUserIds(task: Partial<ITask>): string[];
  notifyTaskCreated(task: ITask): Promise<void>;
  notifyTaskUpdated(updatedTask: Partial<ITask>): Promise<void>;
  notifyTaskDeleted(task: ITask): Promise<void>;
  notifySubtaskUpdated(
    taskId: string,
    subtaskId: string,
    isCompleted: boolean,
    task: Partial<ITask>
  ): Promise<void>;
  notifyTaskStatusUpdated(
    taskId: string,
    status: "pending" | "in-progress" | "completed",
    task: Partial<ITask>
  ): Promise<void>;
}
