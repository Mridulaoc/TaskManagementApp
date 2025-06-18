import { ITask } from "../../../domain/entities/Task";
import { ITaskRepository } from "../../../domain/interfaces/TaskRepository";

export class GetTaskUseCase {
  constructor(private taskRepository: ITaskRepository) {}
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
