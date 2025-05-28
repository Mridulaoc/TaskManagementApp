import { SocketNotificationService } from "../../../infrastructure/services/SocketNotificationService";
import { TaskRepository } from "../../repositories.ts/taskRepo";

export class DeleteTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private notificationService: SocketNotificationService
  ) {}

  async execute(id: string): Promise<boolean> {
    try {
      const task = await this.taskRepository.findById(id);
      if (!task) {
        return false;
      }
      const result = await this.taskRepository.delete(id);
      if (result) {
        await this.notificationService.notifyTaskDeleted(task);
      }

      return await this.taskRepository.delete(id);
    } catch (error) {
      throw new Error("Could not delete the task");
    }
  }
}
