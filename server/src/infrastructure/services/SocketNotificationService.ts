import { ITask } from "../../domain/entities/task";
import { getIO } from "../../services/socketService";

export class SocketNotificationService {
  async notifyTaskCreated(task: ITask): Promise<void> {
    const io = getIO();

    // Notify all assigned users
    task.assignedTo?.forEach((userId) => {
      io.to(`user:${userId}`).emit("task:created", task);
    });
  }
}
