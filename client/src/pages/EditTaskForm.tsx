import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchAllUsers } from "../features/adminSlice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTask, updateTask } from "../features/taskSlice";
import { useFieldArray, useForm } from "react-hook-form";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
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
    formState: { errors, isSubmitting },
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
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md font-['Poppins']">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          <p className="mt-4 text-gray-600">Loading task data...</p>
        </div>
      </div>
    );
  }

  if (!task && !taskLoading) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md font-['Poppins']">
        <div className="text-center py-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mt-4">
            Task not found
          </h3>
          <p className="text-gray-600 mt-2">
            The task you're trying to edit doesn't exist or may have been
            deleted.
          </p>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-[#0a0d3a] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-6 md:my-10 p-6 md:p-8 bg-white rounded-xl shadow-md font-['Poppins']">
      <h2 className="text-xl md:text-2xl font-semibold text-primary mb-2 text-center">
        Edit Task
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title")}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description")}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status<span className="text-red-500">*</span>
            </label>
            <select
              {...register("status")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority<span className="text-red-500">*</span>
            </label>
            <select
              {...register("priority")}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("dueDate")}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
          />
        </div>

        {/* Assigned Users */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned Users <span className="text-red-500">*</span>
          </label>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.assignedTo ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-secondary focus:border-secondary outline-none cursor-pointer flex justify-between items-center`}
          >
            <span className="text-gray-700">
              {assignedTo.length > 0
                ? `${assignedTo.length} user(s) selected`
                : "Select users"}
            </span>
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {dropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
              {loading ? (
                <div className="p-3 text-center text-gray-500">
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="p-3 text-center text-gray-500">
                  No users available
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUserToggle(user._id!)}
                  >
                    <input
                      type="checkbox"
                      checked={assignedTo.includes(user._id!)}
                      onChange={() => handleUserToggle(user._id!)}
                      className="h-4 w-4 text-secondary rounded border-gray-300 focus:ring-secondary cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="ml-3 text-gray-700">{user.name}</span>
                  </div>
                ))
              )}
            </div>
          )}
          {errors.assignedTo && (
            <p className="mt-1 text-sm text-red-600">
              {errors.assignedTo.message}
            </p>
          )}
        </div>

        {/* Subtasks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subtasks<span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-3">
                <div className="flex items-center h-full">
                  <input
                    type="checkbox"
                    {...register(`subtasks.${index}.isCompleted`)}
                    className="h-4 w-4 text-secondary rounded border-gray-300 focus:ring-secondary cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <input
                    {...register(`subtasks.${index}.title`)}
                    placeholder="Enter subtask title"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.subtasks?.[index]?.title
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:ring-2 focus:ring-secondary focus:border-secondary outline-none`}
                  />
                  {errors.subtasks?.[index]?.title && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.subtasks?.[index]?.title?.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                  disabled={fields.length === 1}
                  title="Remove subtask"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({ title: "", isCompleted: false })}
            className="mt-3 flex items-center text-secondary hover:text-[#2a9bd8] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Subtask
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-[#0a0d3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Update Task
          </button>
        </div>
      </form>
    </div>
  );
}
