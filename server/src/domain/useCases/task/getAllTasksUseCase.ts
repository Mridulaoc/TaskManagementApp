import { ITask } from "../../entities/task";
import { TaskRepository } from "../../repositories.ts/taskRepo";

export class GetAllTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}
  async execute(): Promise<ITask[] | null> {
    try {
      const tasks = await this.taskRepository.findAllTasks();
      return tasks;
    } catch (error) {
      throw new Error("Could not fetch tasks");
    }
  }
}
