import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(5, "Description is required"),
  status: z.enum(["pending", "in-progress", "completed"]),
  assignedTo: z.array(z.string()).min(1, "Assign at least one user"),
  dueDate: z.string().transform((val) => (val ? new Date(val) : undefined)),
  priority: z.enum(["low", "medium", "high"]),
  subtasks: z.array(
    z.object({
      title: z.string().min(1, "Subtask title is required"),
      isCompleted: z.boolean(),
    })
  ),
});

export type taskFormData = z.infer<typeof taskSchema>;
