import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "../features/adminSlice";
import { toast } from "react-toast";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTask, updateTask } from "../features/taskSlice";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"]),
  assignedTo: z.array(z.string()).min(1, "Assign at least one user"),
  dueDate: z.string().transform((val) => (val ? new Date(val) : undefined)),
  priority: z.enum(["low", "medium", "high"]),
  subtasks: z
    .array(
      z.object({
        title: z.string().min(1, "Subtask title is required"),
        isCompleted: z.boolean(),
      })
    )
    .optional(),
});

type taskFormData = z.infer<typeof taskSchema>;

export default function EditTaskForm() {
  const { taskId } = useParams<{ taskId: string }>();

  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
      assignedTo: [],
      dueDate: "",
      priority: "medium",
      subtasks: [{ title: "", isCompleted: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const { users } = useSelector((state: RootState) => state.admin);
  const { loading: taskLoading, task } = useSelector(
    (state: RootState) => state.task
  );

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTask(taskId));
    }
  }, [taskId, dispatch]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAllUsers());
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (task && Object.keys(task).length > 0) {
      let formattedDate = "";
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split("T")[0];
        }
      }

      reset({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pending",
        assignedTo: Array.isArray(task.assignedTo)
          ? task.assignedTo.map((user) =>
              typeof user === "string" ? user : user._id
            )
          : [],
        dueDate: formattedDate,
        priority: task.priority || "medium",
        subtasks: task.subtasks?.length
          ? task.subtasks
          : [{ title: "", isCompleted: false }],
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: taskFormData) => {
    try {
      if (taskId) {
        const updatedTaskData = {
          ...data,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        };

        const result = await dispatch(
          updateTask({
            taskId,
            taskData: updatedTaskData,
          })
        );

        if (updateTask.fulfilled.match(result)) {
          const successMessage =
            result.payload?.message || "Task updated successfully";
          toast.success(successMessage);
          navigate("/admin/dashboard");
        } else if (updateTask.rejected.match(result)) {
          const errorMessage =
            result.payload?.message || "Updating task failed";
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred while updating task.");
      }
    }
  };

  const assignedTo = watch("assignedTo") || [];

  const handleUserToggle = (userId: string) => {
    const newAssignedTo = assignedTo.includes(userId)
      ? assignedTo.filter((id) => id !== userId)
      : [...assignedTo, userId];
    setValue("assignedTo", newAssignedTo);
  };

  if (taskLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task data...</p>
        </div>
      </div>
    );
  }

  if (!task && !taskLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow bg-white">
        <div className="text-center">
          <p className="text-red-600 text-lg">Task not found</p>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            {...register("title")}
            className="w-full border px-3 py-2 rounded outline-blue-400"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            {...register("description")}
            className="w-full border px-3 py-2 rounded outline-blue-400"
            rows={3}
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-semibold mb-1">Status</label>
          <select
            {...register("status")}
            className="w-full border px-3 py-2 rounded outline-blue-400"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block font-semibold mb-1">Priority</label>
          <select
            {...register("priority")}
            className="w-full border px-3 py-2 rounded outline-blue-400"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block font-semibold mb-1">Due Date</label>
          <input
            type="date"
            {...register("dueDate")}
            className="w-full border px-3 py-2 rounded outline-blue-400"
          />
        </div>

        {/* Assigned Users */}
        <div className="relative">
          <label className="block font-semibold mb-1">Assigned Users</label>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full border px-3 py-2 rounded outline-blue-400 cursor-pointer flex justify-between items-center"
          >
            <span>
              {assignedTo.length > 0
                ? `${assignedTo.length} user(s) selected`
                : "Select users"}
            </span>
            <span>{dropdownOpen ? "▲" : "▼"}</span>
          </div>

          {dropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
              {loading ? (
                <div className="p-2 text-center">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="p-2 text-center">No users available</div>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleUserToggle(user._id!)}
                  >
                    <input
                      type="checkbox"
                      checked={assignedTo.includes(user._id!)}
                      onChange={() => handleUserToggle(user._id!)}
                      className="mr-2 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>{user.name}</span>
                  </div>
                ))
              )}
            </div>
          )}
          {errors.assignedTo && (
            <p className="text-red-500 text-sm mt-1">
              {errors.assignedTo.message}
            </p>
          )}
        </div>

        {/* Subtasks */}
        <div>
          <label className="block font-semibold mb-1">Subtasks</label>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-2 mb-2 sm:flex-row flex-col"
            >
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  {...register(`subtasks.${index}.isCompleted`)}
                  className="cursor-pointer"
                />
                <input
                  {...register(`subtasks.${index}.title`)}
                  placeholder="Subtask title"
                  className="flex-1 border px-3 py-2 rounded outline-blue-400"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-500 hover:underline text-sm"
                disabled={fields.length === 1}
              >
                ✕ Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ title: "", isCompleted: false })}
            className="text-blue-500 hover:underline text-sm mt-2"
          >
            + Add Subtask
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            disabled={taskLoading}
          >
            {taskLoading ? "Updating..." : "Update Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
