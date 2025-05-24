import mongoose from "mongoose";

export interface ITask {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: mongoose.Types.ObjectId[] | string[];
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  subtasks?: ISubTask[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISubTask {
  title: string;
  isCompleted: boolean;
}

export interface ITaskData {
  title: string;
  status: "pending" | "in-progress" | "completed";
  assignedTo: mongoose.Types.ObjectId[] | string[];
  dueDate?: Date;
  subtasks?: ISubTask[];
}
