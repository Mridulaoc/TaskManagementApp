import { SocketNotificationService } from "../../../infrastructure/services/SocketNotificationService";
import { ITask } from "../../entities/task";
import { TaskRepository } from "../../repositories.ts/taskRepo";

export interface UpdateSubtaskStatusRequest {
  taskId: string;
  subtaskId: string;
  isCompleted: boolean;
}

export class UpdateSubtaskStatusUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private notificationService: SocketNotificationService
  ) {}

  async execute(request: UpdateSubtaskStatusRequest): Promise<ITask> {
    const { taskId, subtaskId, isCompleted } = request;

    if (!taskId || !subtaskId || typeof isCompleted !== "boolean") {
      throw new Error("Invalid input parameters");
    }

    const existingTask = await this.taskRepository.findById(taskId);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    const updatedTask = await this.taskRepository.updateSubtaskStatus(
      taskId,
      subtaskId,
      isCompleted
    );

    await this.notificationService.notifySubtaskUpdated(
      taskId,
      subtaskId,
      isCompleted,
      updatedTask
    );

    return updatedTask;
  }
}
