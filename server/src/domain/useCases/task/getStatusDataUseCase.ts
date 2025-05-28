import { TaskRepository } from "../../repositories.ts/taskRepo";

export interface IChartData {
  labels: string[];
  data: number[];
}

export class GetStatusDataUseCase {
  constructor(private taskRepository: TaskRepository) {}
  async execute(): Promise<IChartData> {
    const statusCounts = await this.taskRepository.getStatusCounts();
    return {
      labels: statusCounts.map((item) => item._id),
      data: statusCounts.map((item) => item.count),
    };
  }
}
