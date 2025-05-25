import { ITask } from "../../entities/task";
import { TaskRepository } from "../../repositories.ts/taskRepo";

export class UpdateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}
  async execute(id: string, data: Partial<ITask>): Promise<ITask | null> {
    try {
      const updatedTask = await this.taskRepository.update(id, data);
      if (!updatedTask) return null;
      return updatedTask;
    } catch (error) {
      throw new Error("Could not update the task");
    }
  }
}
