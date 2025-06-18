import { ITask } from "../../domain/entities/Task";
import { IUser } from "../../domain/entities/User";
import { ISocketNotificationService } from "../../domain/interfaces/SocketNotificationService";
import { emitToUsers, getIO } from "../services/socketService";

export class SocketNotificationService implements ISocketNotificationService {
  extractUserIds(task: Partial<ITask>): string[] {
    if (!task.assignedTo || task.assignedTo.length === 0) return [];

    return task.assignedTo.map((user: string | IUser) =>
      typeof user === "string" ? user : user._id.toString()
    );
  }

  async notifyTaskCreated(task: ITask): Promise<void> {
    try {
      const userIds = this.extractUserIds(task);
      if (userIds.length > 0) {
        emitToUsers(userIds, "task:created", task);
      }
    } catch (error) {
      console.error(" Failed to send task creation notification:", error);
    }
  }

  async notifyTaskUpdated(updatedTask: Partial<ITask>): Promise<void> {
    try {
      const userIds = this.extractUserIds(updatedTask);
      if (userIds.length > 0) {
        emitToUsers(userIds, "task:updated", updatedTask);
      }
    } catch (error) {
      console.error(" Failed to send task updation notification:", error);
    }
  }

  async notifyTaskDeleted(task: ITask) {
    try {
      const userIds = this.extractUserIds(task);
      if (userIds.length > 0) {
        emitToUsers(userIds, "task:deleted", { taskId: task._id });
      }
    } catch (error) {
      console.error(" Failed to send task deletion notification:", error);
    }
  }

  async notifySubtaskUpdated(
    taskId: string,
    subtaskId: string,
    isCompleted: boolean,
    task: Partial<ITask>
  ): Promise<void> {
    try {
      const userIds = this.extractUserIds(task);
      if (userIds.length > 0) {
        emitToUsers(userIds, "subtask:updated", {
          taskId,
          subtaskId,
          isCompleted,
        });
      }
    } catch (error) {
      console.error("Failed to send subtask update notification:", error);
    }
  }

  async notifyTaskStatusUpdated(
    taskId: string,
    status: "pending" | "in-progress" | "completed",
    task: Partial<ITask>
  ): Promise<void> {
    try {
      const userIds = this.extractUserIds(task);
      if (userIds.length > 0) {
        emitToUsers(userIds, "task:status:updated", {
          taskId,
          status,
        });
      }
    } catch (error) {
      console.error("Failed to send task status update notification:", error);
    }
  }
}
