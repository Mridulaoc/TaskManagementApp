import { TaskRepository } from "../../repositories.ts/taskRepo";

export class DeleteTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(id: string): Promise<boolean> {
    try {
      return await this.taskRepository.delete(id);
    } catch (error) {
      throw new Error("Could not delete the task");
    }
  }
}
