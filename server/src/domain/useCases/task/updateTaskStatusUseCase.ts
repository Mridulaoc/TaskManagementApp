import { SocketNotificationService } from "../../../infrastructure/services/SocketNotificationService";
import { ITask } from "../../entities/task";
import { TaskRepository } from "../../repositories.ts/taskRepo";

export interface UpdateTaskStatusRequest {
  taskId: string;
  status: "pending" | "in-progress" | "completed";
}

export class UpdateTaskStatusUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private notificationService: SocketNotificationService
  ) {}

  async execute(request: UpdateTaskStatusRequest): Promise<ITask> {
    const { taskId, status } = request;

    if (!taskId || !status) {
      throw new Error("Invalid input parameters");
    }

    const validStatuses = ["pending", "in-progress", "completed"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status value");
    }

    const existingTask = await this.taskRepository.findById(taskId);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    const updatedTask = await this.taskRepository.updateTaskStatus(
      taskId,
      status
    );
    await this.notificationService.notifyTaskStatusUpdated(
      taskId,
      status,
      updatedTask
    );
    return updatedTask;
  }
}
