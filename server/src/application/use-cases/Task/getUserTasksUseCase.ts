import { ITask } from "../../../domain/entities/Task";
import { ITaskRepository } from "../../../domain/interfaces/TaskRepository";

export class GetUserTasksUseCase {
  constructor(private taskRepository: ITaskRepository) {}
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
