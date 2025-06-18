import mongoose, { Schema } from "mongoose";
import { ISubTask, ITask } from "../../../domain/entities/Task";

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

TaskSchema.pre("save", function (next) {
  if (this.subtasks && this.subtasks.length > 0) {
    const completedSubtasks = this.subtasks.filter(
      (st) => st.isCompleted
    ).length;
    const totalSubtasks = this.subtasks.length;

    if (completedSubtasks === 0) {
      this.status = "pending";
    } else if (completedSubtasks === totalSubtasks) {
      this.status = "completed";
    } else {
      this.status = "in-progress";
    }
  }
  next();
});

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
