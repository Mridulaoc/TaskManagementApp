import { ITask } from "../../entities/task";
import { TaskRepository } from "../../repositories.ts/taskRepo";

export class GetUserTasksUseCase {
  constructor(private taskRepository: TaskRepository) {}
  async execute(userId: string): Promise<ITask[]> {
    try {
      const userTasks = await this.taskRepository.findUserTasks(userId);
      if (!userTasks) return [];
      return userTasks;
    } catch (error) {
      throw new Error("Could not fetch tasks for the user");
    }
  }
}
