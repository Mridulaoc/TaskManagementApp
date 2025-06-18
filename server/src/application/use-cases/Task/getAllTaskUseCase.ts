import { ITask } from "../../../domain/entities/Task";
import { ITaskRepository } from "../../../domain/interfaces/TaskRepository";

export class GetAllTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}
  async execute(
    page: number,
    limit: number
  ): Promise<{ tasks: ITask[]; total: number }> {
    try {
      const result = await this.taskRepository.findAllTasks(page, limit);
      return result;
    } catch (error) {
      throw new Error("Could not fetch tasks");
    }
  }
}
