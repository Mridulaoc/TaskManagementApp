import { ITaskRepository } from "../../../domain/interfaces/TaskRepository";

export interface IChartData {
  labels: string[];
  data: number[];
}

export class GetStatusDataUseCase {
  constructor(private taskRepository: ITaskRepository) {}
  async execute(): Promise<IChartData> {
    const statusCounts = await this.taskRepository.getStatusCounts();
    return {
      labels: statusCounts.map((item) => item._id),
      data: statusCounts.map((item) => item.count),
    };
  }
}
