import { ITask } from "../../../domain/entities/Task";
import { ISocketNotificationService } from "../../../domain/interfaces/SocketNotificationService";
import { ITaskRepository } from "../../../domain/interfaces/TaskRepository";

export interface UpdateSubtaskStatusRequest {
  taskId: string;
  subtaskId: string;
  isCompleted: boolean;
}

export class UpdateSubtaskStatusUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private notificationService: ISocketNotificationService
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
