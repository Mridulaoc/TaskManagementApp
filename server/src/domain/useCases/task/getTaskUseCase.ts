import { ITask } from "../../entities/task";
import { TaskRepository } from "../../repositories.ts/taskRepo";

export class GetTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}
  async execute(id: string): Promise<ITask | null> {
    try {
      const task = await this.taskRepository.findById(id);
      if (!task) return null;
      return task;
    } catch (error) {
      throw new Error("Could not fetch task");
    }
  }
}
