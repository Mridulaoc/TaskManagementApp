import mongoose, { Schema } from "mongoose";
import { ISubTask, ITask } from "../domain/entities/task";

const SubTaskSchema = new Schema<ISubTask>({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
});

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    subtasks: [SubTaskSchema],
  },
  { timestamps: true }
);

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
