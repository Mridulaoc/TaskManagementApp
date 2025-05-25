import Task from "../../models/taskModel";
import { ITask, ITaskData } from "../entities/task";

export class TaskRepository {
  async create(data: ITaskData): Promise<ITask | null> {
    try {
      const task = new Task(data);
      task.save();
      return task;
    } catch (error) {
      throw new Error("Could not create Task");
    }
  }

  async findAllTasks(): Promise<ITask[] | null> {
    try {
      const tasks = await Task.find().populate("assignedTo", "name email");

      return tasks;
    } catch (error) {
      throw new Error("Could not fetch Tasks");
    }
  }

  async findById(id: string): Promise<ITask | null> {
    try {
      const task = await Task.findById(id);

      return task;
    } catch (error) {
      throw new Error("Could not find task by given id");
    }
  }

  async update(id: string, data: Partial<ITask>): Promise<ITask | null> {
    try {
      const task = await Task.findByIdAndUpdate(id, data, { new: true });

      return task;
    } catch (error) {
      throw new Error(" Could not update the task");
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await Task.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error("Could not delete the task");
    }
  }
}
