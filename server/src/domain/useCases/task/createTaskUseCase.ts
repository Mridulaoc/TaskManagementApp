import { SocketNotificationService } from "../../../infrastructure/services/SocketNotificationService";
import { ITask, ITaskData } from "../../entities/task";
import { TaskRepository } from "../../repositories.ts/taskRepo";

export class CreateTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private notificationService: SocketNotificationService
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
