import mongoose from "mongoose";
import Task from "../models/TaskModel";
import { ITask, ITaskData } from "../../../domain/entities/Task";
import { ITaskRepository } from "../../../domain/interfaces/TaskRepository";

export class TaskRepository implements ITaskRepository {
  async create(data: ITaskData): Promise<ITask | null> {
    try {
      const task = new Task(data);
      const savedTask = await task.save();
      const populatedTask = await Task.findById(savedTask._id).populate(
        "assignedTo",
        "name,email"
      );
      return populatedTask;
    } catch (error) {
      throw new Error("Could not create Task");
    }
  }

  async findAllTasks(
    page: number,
    limit: number
  ): Promise<{ tasks: ITask[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const tasks = await Task.find()
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      const total = await Task.countDocuments();

      return { tasks, total };
    } catch (error) {
      throw new Error("Could not fetch Tasks");
    }
  }

  async findById(id: string): Promise<ITask | null> {
    try {
      const task = await Task.findById(id).populate("assignedTo", "name,email");

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

  async findUserTasks(userId: string): Promise<ITask[]> {
    try {
      const userTasks = await Task.find({
        assignedTo: new mongoose.Types.ObjectId(userId),
      }).sort({ createdAt: -1 });
      if (!userTasks) return [];

      return userTasks;
    } catch (error) {
      throw new Error("Could not fetch tasks for the user");
    }
  }

  async updateSubtaskStatus(
    taskId: string,
    subtaskId: string,
    isCompleted: boolean
  ): Promise<ITask> {
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error("Task not found");
      }

      const subtask = task.subtasks?.find(
        (subtask) => subtask._id?.toString() === subtaskId
      );
      if (!subtask) {
        throw new Error("Subtask not found");
      }

      subtask.isCompleted = isCompleted;
      const updatedTask = await task.save();
      return updatedTask;
    } catch (error) {
      throw new Error(`Failed to update subtask status: ${error}`);
    }
  }
  async updateTaskStatus(
    taskId: string,
    status: "pending" | "in-progress" | "completed"
  ): Promise<ITask> {
    try {
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { status },
        { new: true }
      );

      if (!updatedTask) {
        throw new Error("Task not found");
      }

      return updatedTask;
    } catch (error) {
      throw new Error(`Failed to update task status: ${error}`);
    }
  }

  async getStatusCounts() {
    return Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
  }

  async getPriorityCounts() {
    return Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
  }
}
