import { ITask, ITaskData } from "../../../domain/entities/Task";
import { ISocketNotificationService } from "../../../domain/interfaces/SocketNotificationService";
import { ITaskRepository } from "../../../domain/interfaces/TaskRepository";

export class CreateTaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private notificationService: ISocketNotificationService
  ) {}

  async execute(data: ITaskData): Promise<ITask | null> {
    try {
      const task = await this.taskRepository.create(data);
      if (!task) return null;
      await this.notificationService.notifyTaskCreated(task);
      return task;
    } catch (error) {
      throw new Error("Failed to create task");
    }
  }
}
