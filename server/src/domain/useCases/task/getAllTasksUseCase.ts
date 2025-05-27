import { ITask } from "../../entities/task";
import { TaskRepository } from "../../repositories.ts/taskRepo";

export class GetAllTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}
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
