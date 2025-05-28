import { TaskRepository } from "../../repositories.ts/taskRepo";

export interface IChartData {
  labels: string[];
  data: number[];
}

export class GetPriorityDataUseCase {
  constructor(private taskRepository: TaskRepository) {}
  async execute(): Promise<IChartData> {
    const priorityCounts = await this.taskRepository.getPriorityCounts();

    const priorityOrder = ["low", "medium", "high"];
    const priorityData = priorityOrder.map((p) => {
      const index = priorityCounts.findIndex((item) => item._id === p);
      return index !== -1 ? priorityCounts[index].count : 0;
    });

    return {
      labels: priorityOrder,
      data: priorityData,
    };
  }
}
