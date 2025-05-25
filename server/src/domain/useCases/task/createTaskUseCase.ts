import { ITask, ITaskData } from "../../entities/task";
import { TaskRepository } from "../../repositories.ts/taskRepo";

export class CreateTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(data: ITaskData): Promise<ITask | null> {
    try {
      const task = await this.taskRepository.create(data);
      return task;
    } catch (error) {
      throw new Error("Failed to create task");
    }
  }
}
