import Task from "../../models/taskModel";
import { ITask, ITaskData } from "../entities/task";

export class TaskRepository {
  async create(data: ITaskData): Promise<ITask> {
    const task = await new Task(data);
    task.save();
    return task;
  }

  async findAllTasks(): Promise<ITask[]> {
    const tasks = await Task.find().populate("assignedTo", "name email");
    return tasks;
  }

  async findById(id: string): Promise<ITask | null> {
    const task = await Task.findById(id);
    if (!task) return null;
    return task;
  }

  async update(id: string, data: Partial<ITask>): Promise<ITask | null> {
    const task = await Task.findByIdAndUpdate(id, data, { new: true });
    if (!task) {
      throw new Error(" Could not update the task");
    }
    return task;
  }

  async delete(id: string): Promise<void> {
    await Task.findByIdAndDelete(id);
  }
}
