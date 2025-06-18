import { ITask } from "../../../domain/entities/Task";
import { ISocketNotificationService } from "../../../domain/interfaces/SocketNotificationService";
import { ITaskRepository } from "../../../domain/interfaces/TaskRepository";

export class UpdateTaskUseCase {
  constructor(
    private taskRepository: ITaskRepository,
    private notificationService: ISocketNotificationService
  ) {}
  async execute(id: string, data: Partial<ITask>): Promise<ITask | null> {
    try {
      const updatedTask = await this.taskRepository.update(id, data);
      if (!updatedTask) return null;
      await this.notificationService.notifyTaskUpdated(updatedTask);
      if (!updatedTask) return null;

      return updatedTask;
    } catch (error) {
      throw new Error("Could not update the task");
    }
  }
}
